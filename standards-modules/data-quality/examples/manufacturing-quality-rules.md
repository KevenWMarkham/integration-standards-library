# Manufacturing Quality Rules Example

> Module: ISL-06 | Version: 1.0 | Type: Example

## Purpose

This document provides a fully completed example of data quality rules implemented for a discrete manufacturing environment. It covers BOM integrity, work order validation, production metrics accuracy, inventory quantity checks, cost roll-up validation, quality inspection rules, IoT data quality rules, and ERP-specific rules for SAP and Epicor. All rules include concrete SQL implementations tested against representative manufacturing data structures.

## Manufacturing Data Context

This example assumes a discrete manufacturing company with the following systems and data sources:

| System | Role | Key Tables |
|---|---|---|
| SAP S/4HANA (or Epicor Kinetic) | ERP — planning, finance, inventory | MARA (materials), AUFK (work orders), MSEG (material movements), COBK (cost objects) |
| Aveva MES (or Plex) | Manufacturing Execution | production_orders, production_output, machine_events |
| Kepware/Ignition | IoT Gateway | sensor_readings, machine_telemetry |
| QMS (ETQ or similar) | Quality Management | inspections, dispositions, ncr_records |

### Silver Layer Table Structures

```sql
-- Product Master (from SAP MARA / Epicor Part)
silver.product_master (
    item_id             STRING,       -- material number / part number
    description         STRING,
    product_type        STRING,       -- 'FG', 'SFG', 'RM', 'PKG'
    uom                 STRING,
    standard_cost       DECIMAL(12,4),
    unit_weight         DECIMAL(10,4),
    weight_uom          STRING,
    is_active           BOOLEAN,
    last_modified       TIMESTAMP
)

-- Bill of Materials (from SAP BOM / Epicor BOM)
silver.bom (
    bom_id              STRING,
    parent_item_id      STRING,       -- FK to product_master
    child_item_id       STRING,       -- FK to product_master
    qty_per             DECIMAL(10,4),
    uom                 STRING,
    effective_date      DATE,
    expiry_date         DATE,
    bom_level           INT,
    is_active           BOOLEAN
)

-- Work Orders (from SAP AUFK / Epicor JobHead)
silver.work_orders (
    work_order_id       STRING,
    product_id          STRING,       -- FK to product_master
    planned_qty         DECIMAL(12,4),
    actual_qty          DECIMAL(12,4),
    scrap_qty           DECIMAL(12,4),
    status              STRING,       -- Created, Released, In Progress, Completed, Closed, Cancelled
    planned_start       TIMESTAMP,
    actual_start        TIMESTAMP,
    planned_end         TIMESTAMP,
    actual_end          TIMESTAMP,
    created_date        TIMESTAMP,
    last_modified       TIMESTAMP
)

-- Production Output (from MES)
silver.production_output (
    output_id           STRING,
    work_order_id       STRING,       -- FK to work_orders
    machine_id          STRING,
    output_lot_number   STRING,
    good_qty            DECIMAL(12,4),
    reject_qty          DECIMAL(12,4),
    total_qty           DECIMAL(12,4),
    reported_yield      DECIMAL(6,4),
    output_timestamp    TIMESTAMP
)

-- Inventory (from SAP MARD / Epicor PartWhse)
silver.inventory (
    item_id             STRING,       -- FK to product_master
    warehouse_id        STRING,
    location_id         STRING,
    lot_number          STRING,
    on_hand_qty         DECIMAL(12,4),
    reserved_qty        DECIMAL(12,4),
    available_qty       DECIMAL(12,4),
    last_transaction    TIMESTAMP
)

-- Sensor Readings (from IoT Gateway)
silver.sensor_readings (
    reading_id          STRING,
    sensor_id           STRING,
    machine_id          STRING,
    reading_value       DECIMAL(12,4),
    reading_unit        STRING,
    reading_timestamp   TIMESTAMP,
    quality_flag        STRING        -- 'GOOD', 'SUSPECT', 'BAD'
)

-- Quality Inspections (from QMS)
silver.quality_inspections (
    inspection_id       STRING,
    work_order_id       STRING,
    characteristic_id   STRING,
    measurement_value   DECIMAL(12,6),
    lower_spec_limit    DECIMAL(12,6),
    upper_spec_limit    DECIMAL(12,6),
    result              STRING,       -- 'PASS', 'FAIL', 'HOLD'
    inspector_id        STRING,
    inspection_date     TIMESTAMP
)
```

---

## BOM Integrity Rules

### Rule: BOM Circular Reference Detection

```sql
-- QR-B01 Implementation: Detect circular references in BOM hierarchy
-- Severity: Critical | Dimension: Consistency, Validity

WITH RECURSIVE bom_paths AS (
    -- Anchor: all top-level parents
    SELECT
        parent_item_id,
        child_item_id,
        ARRAY(parent_item_id) AS path,
        1 AS depth,
        FALSE AS is_circular
    FROM silver.bom
    WHERE is_active = TRUE

    UNION ALL

    SELECT
        b.parent_item_id,
        b.child_item_id,
        ARRAY_UNION(bp.path, ARRAY(b.parent_item_id)),
        bp.depth + 1,
        ARRAY_CONTAINS(bp.path, b.child_item_id) AS is_circular
    FROM silver.bom b
    JOIN bom_paths bp ON b.parent_item_id = bp.child_item_id
    WHERE bp.depth < 15 AND bp.is_circular = FALSE AND b.is_active = TRUE
)
SELECT parent_item_id, child_item_id, path, depth
FROM bom_paths
WHERE is_circular = TRUE;
-- Expected: 0 rows (no circular references)
```

### Rule: BOM Component Existence

```sql
-- QR-B01 Implementation: All BOM components exist in product master
-- Severity: Critical | Dimension: Consistency

SELECT b.bom_id, b.child_item_id AS orphan_component
FROM silver.bom b
LEFT JOIN silver.product_master p ON b.child_item_id = p.item_id
WHERE p.item_id IS NULL AND b.is_active = TRUE;
-- Expected: 0 rows
```

### Rule: BOM Quantity Positive

```sql
-- QR-B01 Implementation: All BOM quantities are positive
-- Severity: Major | Dimension: Validity

SELECT bom_id, parent_item_id, child_item_id, qty_per
FROM silver.bom
WHERE qty_per <= 0 AND is_active = TRUE;
-- Expected: 0 rows
```

---

## Work Order Validation Rules

### Rule: Work Order Status Transition Validity

```sql
-- QR-B02 Implementation: Validate work order status transitions
-- Severity: Major | Dimension: Validity, Consistency

WITH wo_transitions AS (
    SELECT
        work_order_id,
        status AS current_status,
        LAG(status) OVER (PARTITION BY work_order_id ORDER BY last_modified) AS prev_status
    FROM silver.work_order_history
)
SELECT work_order_id, prev_status, current_status
FROM wo_transitions
WHERE prev_status IS NOT NULL
  AND (prev_status, current_status) NOT IN (
    ('Created', 'Released'),
    ('Created', 'Cancelled'),
    ('Released', 'In Progress'),
    ('Released', 'Cancelled'),
    ('Released', 'On Hold'),
    ('On Hold', 'Released'),
    ('On Hold', 'Cancelled'),
    ('In Progress', 'Completed'),
    ('In Progress', 'On Hold'),
    ('In Progress', 'Cancelled'),
    ('Completed', 'Closed')
  );
-- Expected: 0 rows for valid state machine
```

### Rule: Work Order Date Consistency

```sql
-- QR-R11 / QR-R15 Implementation: Work order dates in chronological order
-- Severity: Major | Dimension: Consistency, Validity

SELECT work_order_id, created_date, planned_start, planned_end, actual_start, actual_end
FROM silver.work_orders
WHERE (planned_end IS NOT NULL AND planned_start IS NOT NULL AND planned_end < planned_start)
   OR (actual_end IS NOT NULL AND actual_start IS NOT NULL AND actual_end < actual_start)
   OR (actual_start IS NOT NULL AND created_date IS NOT NULL AND actual_start < created_date);
-- Expected: 0 rows
```

### Rule: Work Order Product Validity

```sql
-- QR-S05 Implementation: Work order products exist in product master
-- Severity: Critical | Dimension: Consistency

SELECT wo.work_order_id, wo.product_id
FROM silver.work_orders wo
LEFT JOIN silver.product_master p ON wo.product_id = p.item_id
WHERE p.item_id IS NULL;
-- Expected: 0 rows
```

---

## Production Metrics Accuracy Rules

### Rule: Yield Calculation Accuracy

```sql
-- QR-B08 Implementation: Verify reported yield matches calculated yield
-- Severity: Major | Dimension: Accuracy

SELECT
    output_id,
    work_order_id,
    good_qty,
    total_qty,
    reported_yield,
    CASE WHEN total_qty > 0 THEN good_qty / total_qty ELSE NULL END AS calculated_yield,
    ABS(reported_yield - (good_qty / NULLIF(total_qty, 0))) AS yield_delta
FROM silver.production_output
WHERE total_qty > 0
  AND ABS(reported_yield - (good_qty / total_qty)) > 0.001;
-- Expected: 0 rows (yield values must be consistent)
```

### Rule: Production Output Balance

```sql
-- QR-B03 Implementation: good_qty + reject_qty = total_qty
-- Severity: Critical | Dimension: Accuracy

SELECT output_id, work_order_id, good_qty, reject_qty, total_qty,
       (good_qty + reject_qty) AS expected_total,
       ABS(total_qty - (good_qty + reject_qty)) AS delta
FROM silver.production_output
WHERE ABS(total_qty - (good_qty + reject_qty)) > 0.001;
-- Expected: 0 rows
```

### Rule: Scheduled vs Actual Variance

```sql
-- QR-B10 Implementation: Production variance within 15%
-- Severity: Major | Dimension: Accuracy, Consistency

SELECT
    work_order_id,
    planned_qty,
    actual_qty,
    ABS(planned_qty - actual_qty) * 100.0 / NULLIF(planned_qty, 0) AS variance_pct
FROM silver.work_orders
WHERE status IN ('Completed', 'Closed')
  AND planned_qty > 0
  AND ABS(planned_qty - actual_qty) * 100.0 / planned_qty > 15.0;
-- Flag for investigation; not necessarily a data quality error
```

---

## Inventory Quantity Rules

### Rule: Non-Negative Inventory

```sql
-- QR-B05 Implementation: No negative on-hand quantities
-- Severity: Critical | Dimension: Validity, Accuracy

SELECT item_id, warehouse_id, location_id, on_hand_qty
FROM silver.inventory
WHERE on_hand_qty < 0;
-- Expected: 0 rows
```

### Rule: Available Quantity Consistency

```sql
-- QR-R11 Implementation: available_qty = on_hand_qty - reserved_qty
-- Severity: Major | Dimension: Accuracy, Consistency

SELECT item_id, warehouse_id, on_hand_qty, reserved_qty, available_qty,
       (on_hand_qty - reserved_qty) AS expected_available,
       ABS(available_qty - (on_hand_qty - reserved_qty)) AS delta
FROM silver.inventory
WHERE ABS(available_qty - (on_hand_qty - reserved_qty)) > 0.001;
-- Expected: 0 rows
```

### Rule: Reserved Quantity Non-Negative

```sql
-- QR-B05 Variant: No negative reserved quantities
-- Severity: Critical | Dimension: Validity

SELECT item_id, warehouse_id, reserved_qty
FROM silver.inventory
WHERE reserved_qty < 0;
-- Expected: 0 rows
```

---

## Cost Roll-Up Validation Rules

### Rule: BOM Cost Roll-Up Accuracy

```sql
-- QR-B06 Implementation: Parent cost = SUM(child cost * qty_per)
-- Severity: Critical | Dimension: Accuracy

WITH component_costs AS (
    SELECT
        b.parent_item_id,
        SUM(c.standard_cost * b.qty_per) AS calculated_material_cost
    FROM silver.bom b
    JOIN silver.product_master c ON b.child_item_id = c.item_id
    WHERE b.is_active = TRUE
    GROUP BY b.parent_item_id
)
SELECT
    p.item_id,
    p.standard_cost AS parent_standard_cost,
    cc.calculated_material_cost,
    ABS(p.standard_cost - cc.calculated_material_cost) AS cost_delta
FROM silver.product_master p
JOIN component_costs cc ON p.item_id = cc.parent_item_id
WHERE p.product_type IN ('FG', 'SFG')
  AND ABS(p.standard_cost - cc.calculated_material_cost) > 0.01;
-- Note: This simplified check excludes labor/overhead routing costs
```

### Rule: Zero Cost Detection

```sql
-- QR-R02 Implementation: Active products should not have zero cost
-- Severity: Major | Dimension: Accuracy

SELECT item_id, description, product_type, standard_cost
FROM silver.product_master
WHERE is_active = TRUE
  AND product_type IN ('FG', 'SFG', 'RM')
  AND (standard_cost IS NULL OR standard_cost = 0);
-- Expected: 0 rows for active manufactured/purchased items
```

---

## Quality Inspection Rules

### Rule: Inspection Within Specification

```sql
-- QR-B04 Implementation: All inspections have valid spec limits and results
-- Severity: Critical | Dimension: Validity, Accuracy

SELECT inspection_id, characteristic_id, measurement_value,
       lower_spec_limit, upper_spec_limit, result
FROM silver.quality_inspections
WHERE (measurement_value < lower_spec_limit OR measurement_value > upper_spec_limit)
  AND result = 'PASS';
-- Expected: 0 rows (out-of-spec should not be marked PASS)
```

### Rule: Inspection Completeness for Completed Work Orders

```sql
-- QR-B09 Variant: Completed WOs must have associated inspections
-- Severity: Critical | Dimension: Completeness

SELECT wo.work_order_id, wo.product_id, wo.status
FROM silver.work_orders wo
LEFT JOIN silver.quality_inspections qi ON wo.work_order_id = qi.work_order_id
WHERE wo.status IN ('Completed', 'Closed')
  AND qi.inspection_id IS NULL;
-- Expected: 0 rows for products requiring inspection
```

### Rule: Inspector Authorization

```sql
-- QR-R04 Implementation: Inspector IDs must be valid authorized inspectors
-- Severity: Major | Dimension: Validity

SELECT qi.inspection_id, qi.inspector_id
FROM silver.quality_inspections qi
LEFT JOIN silver.authorized_inspectors ai ON qi.inspector_id = ai.inspector_id
WHERE ai.inspector_id IS NULL;
-- Expected: 0 rows
```

---

## IoT Data Quality Rules

### Rule: Sensor Reading Range Validation

```sql
-- QR-B13 Implementation: Readings within sensor operational range
-- Severity: Major | Dimension: Validity, Accuracy

SELECT sr.reading_id, sr.sensor_id, sr.reading_value,
       s.min_operational_range, s.max_operational_range
FROM silver.sensor_readings sr
JOIN silver.sensor_registry s ON sr.sensor_id = s.sensor_id
WHERE sr.reading_value < s.min_operational_range
   OR sr.reading_value > s.max_operational_range;
-- Flag as potential sensor malfunction
```

### Rule: Sensor Reading Freshness

```sql
-- QR-A05 Implementation: All active sensors must report within 15 minutes
-- Severity: Critical | Dimension: Timeliness

SELECT s.sensor_id, s.machine_id,
       MAX(sr.reading_timestamp) AS last_reading,
       DATEDIFF(MINUTE, MAX(sr.reading_timestamp), CURRENT_TIMESTAMP) AS minutes_since
FROM silver.sensor_registry s
LEFT JOIN silver.sensor_readings sr ON s.sensor_id = sr.sensor_id
WHERE s.is_active = TRUE
GROUP BY s.sensor_id, s.machine_id
HAVING MAX(sr.reading_timestamp) IS NULL
    OR DATEDIFF(MINUTE, MAX(sr.reading_timestamp), CURRENT_TIMESTAMP) > 15;
```

### Rule: Sensor Reading Rate-of-Change

```sql
-- QR-B13 Variant: Detect physically implausible rate-of-change
-- Severity: Major | Dimension: Accuracy

WITH sensor_deltas AS (
    SELECT
        sensor_id,
        reading_value,
        reading_timestamp,
        LAG(reading_value) OVER (PARTITION BY sensor_id ORDER BY reading_timestamp) AS prev_value,
        LAG(reading_timestamp) OVER (PARTITION BY sensor_id ORDER BY reading_timestamp) AS prev_timestamp
    FROM silver.sensor_readings
    WHERE reading_timestamp >= DATEADD(HOUR, -24, CURRENT_TIMESTAMP)
)
SELECT sensor_id, reading_timestamp, reading_value, prev_value,
       ABS(reading_value - prev_value) AS absolute_change,
       DATEDIFF(SECOND, prev_timestamp, reading_timestamp) AS interval_seconds
FROM sensor_deltas
WHERE prev_value IS NOT NULL
  AND ABS(reading_value - prev_value) > 100  -- configurable per sensor type
  AND DATEDIFF(SECOND, prev_timestamp, reading_timestamp) < 60;
-- Detects physically impossible jumps (e.g., temperature jumps 100 degrees in < 1 minute)
```

---

## SAP-Specific Rules

### Rule: SAP Material Type Consistency

```sql
-- SAP-specific: Material type matches ISL product_type mapping
-- Severity: Minor | Dimension: Consistency

SELECT item_id, sap_material_type, product_type
FROM silver.product_master
WHERE (sap_material_type = 'FERT' AND product_type != 'FG')
   OR (sap_material_type = 'HALB' AND product_type != 'SFG')
   OR (sap_material_type = 'ROH' AND product_type != 'RM')
   OR (sap_material_type = 'VERP' AND product_type != 'PKG');
```

### Rule: SAP Document Number Format

```sql
-- SAP-specific: Document numbers follow SAP numbering format
-- Severity: Minor | Dimension: Validity

SELECT work_order_id
FROM silver.work_orders
WHERE NOT work_order_id RLIKE '^[0-9]{10,12}$';
-- SAP production order numbers are typically 10-12 digit numeric
```

---

## Epicor-Specific Rules

### Rule: Epicor Job Number Format

```sql
-- Epicor-specific: Job numbers follow Epicor format
-- Severity: Minor | Dimension: Validity

SELECT work_order_id
FROM silver.work_orders
WHERE NOT work_order_id RLIKE '^[A-Z]{0,3}[0-9]{4,8}(-[0-9]{1,3})?$';
-- Epicor job numbers typically have optional prefix + numeric + optional assembly
```

### Rule: Epicor Part Class Validity

```sql
-- Epicor-specific: Part class codes are valid
-- Severity: Minor | Dimension: Validity

SELECT item_id, epicor_part_class
FROM silver.product_master
WHERE epicor_part_class IS NOT NULL
  AND epicor_part_class NOT IN (
    SELECT class_id FROM silver.epicor_part_classes WHERE is_active = TRUE
  );
```

---

## Rule Execution Summary

| Rule | ISL Rule ID | Severity | Dimension | Expected Result |
|---|---|---|---|---|
| BOM Circular Reference | QR-B01 | Critical | Consistency | 0 circular refs |
| BOM Component Existence | QR-B01 | Critical | Consistency | 0 orphan components |
| BOM Quantity Positive | QR-B01 | Major | Validity | 0 non-positive |
| WO Status Transitions | QR-B02 | Major | Validity | 0 invalid transitions |
| WO Date Consistency | QR-R15 | Major | Consistency | 0 out-of-order dates |
| WO Product Validity | QR-S05 | Critical | Consistency | 0 invalid products |
| Yield Accuracy | QR-B08 | Major | Accuracy | 0 miscalculations |
| Output Balance | QR-B03 | Critical | Accuracy | 0 imbalanced records |
| Scheduled vs Actual | QR-B10 | Major | Accuracy | < 15% variance |
| Non-Negative Inventory | QR-B05 | Critical | Validity | 0 negative |
| Available Qty Consistency | QR-R11 | Major | Accuracy | 0 inconsistent |
| Cost Roll-Up | QR-B06 | Critical | Accuracy | < $0.01 delta |
| Inspection Spec Limits | QR-B04 | Critical | Validity | 0 misclassified |
| Inspection Completeness | QR-B09 | Critical | Completeness | 0 missing inspections |
| Sensor Range | QR-B13 | Major | Validity | 0 out-of-range |
| Sensor Freshness | QR-A05 | Critical | Timeliness | 0 stale sensors |
| Sensor Rate-of-Change | QR-B13 | Major | Accuracy | 0 implausible |

---

## Cross-References

| Reference | Module | Relationship |
|---|---|---|
| Quality Rule Library | ISL-06 | Rule definitions that these implementations follow |
| Quality Dimension Definitions | ISL-06 | Dimension categorization for each rule |
| Quality SLA Framework | ISL-06 | Thresholds that determine pass/fail |
| Fabric Quality Implementation | ISL-06 | PySpark patterns for executing these rules |
| ISL-05 Medallion Architecture | ISL-05 | Silver layer table structures referenced above |

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2025-01-15 | ISL Team | Initial release — manufacturing quality rules example |
