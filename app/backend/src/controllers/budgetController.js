const db = require('../db');

const getBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    try {
      const result = await db.query(
        'SELECT * FROM v_budget_breakdown WHERE trip_id = $1',
        [tripId]
      );
      if (!result.rows[0]) {
        return res.status(404).json({ success: false, message: 'Budget not found' });
      }
      return res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      // If the view doesn't exist, fall back to computing the values from core tables
      if (err && err.code === '42P01') {
        const fallbackSql = `
SELECT
  t.id                                AS trip_id,
  t.name                              AS trip_name,
  tb.total_budget,
  tb.transport_cost,
  tb.stay_cost,
  tb.activity_cost,
  tb.meals_cost,
  tb.misc_cost,
  tb.currency,
  ROUND(tb.transport_cost / NULLIF(t.end_date - t.start_date, 0), 2) AS transport_per_day,
  ROUND(tb.stay_cost      / NULLIF(t.end_date - t.start_date, 0), 2) AS stay_per_day,
  ROUND(tb.activity_cost  / NULLIF(t.end_date - t.start_date, 0), 2) AS activity_per_day,
  ROUND(tb.meals_cost     / NULLIF(t.end_date - t.start_date, 0), 2) AS meals_per_day,
  ROUND((tb.transport_cost + tb.stay_cost + tb.activity_cost + tb.meals_cost + tb.misc_cost)
        / NULLIF(t.end_date - t.start_date, 0), 2)                  AS total_per_day,
  ROUND(((tb.transport_cost + tb.stay_cost + tb.activity_cost + tb.meals_cost + tb.misc_cost)
        / NULLIF(tb.total_budget, 0)) * 100, 1)                      AS budget_used_pct
FROM trips t
JOIN trip_budgets tb ON tb.trip_id = t.id
WHERE t.id = $1
`;
        const fallbackRes = await db.query(fallbackSql, [tripId]);
        if (!fallbackRes.rows[0]) {
          return res.status(404).json({ success: false, message: 'Budget not found' });
        }
        return res.json({ success: true, data: fallbackRes.rows[0] });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { total_budget, transport_cost, stay_cost, activity_cost, meals_cost, misc_cost, currency } = req.body;
    const totalBudgetValue = Number.isFinite(Number(total_budget)) ? Number(total_budget) : 0;
    const transportCostValue = Number.isFinite(Number(transport_cost)) ? Number(transport_cost) : 0;
    const stayCostValue = Number.isFinite(Number(stay_cost)) ? Number(stay_cost) : 0;
    const activityCostValue = Number.isFinite(Number(activity_cost)) ? Number(activity_cost) : 0;
    const mealsCostValue = Number.isFinite(Number(meals_cost)) ? Number(meals_cost) : 0;
    const miscCostValue = Number.isFinite(Number(misc_cost)) ? Number(misc_cost) : 0;
    const currencyValue = typeof currency === 'string' && currency.trim() ? currency.trim() : 'USD';
    const result = await db.query(
      'INSERT INTO trip_budgets (trip_id, total_budget, transport_cost, stay_cost, activity_cost, meals_cost, misc_cost, currency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (trip_id) DO UPDATE SET total_budget = $2, transport_cost = $3, stay_cost = $4, activity_cost = $5, meals_cost = $6, misc_cost = $7, currency = $8 RETURNING *',
      [tripId, totalBudgetValue, transportCostValue, stayCostValue, activityCostValue, mealsCostValue, miscCostValue, currencyValue]
    );
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Budget updated',
    });
  } catch (err) {
    next(err);
  }
};

const getBudgetAlerts = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await db.query(
      'SELECT * FROM budget_day_alerts WHERE trip_id = $1',
      [tripId]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBudget,
  updateBudget,
  getBudgetAlerts,
};
