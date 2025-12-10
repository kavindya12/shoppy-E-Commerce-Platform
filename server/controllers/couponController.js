import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found or inactive' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ error: 'Coupon expired' });
    }
    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ error: `Minimum order is $${coupon.minOrder}` });
    }
    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = (orderTotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    res.json({
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrder: coupon.minOrder,
      expiresAt: coupon.expiresAt,
    });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrder, expiresAt } = req.body;
    const coupon = new Coupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      minOrder,
      expiresAt,
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    next(err);
  }
};
