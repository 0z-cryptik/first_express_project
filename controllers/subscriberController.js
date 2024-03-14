"use strict";

const mongoose = require("mongoose");
const Subscriber = require("../models/subscribers");

module.exports = {
  create: (req, res) => {
    try {
      res.status(200).render("subscribers/new");
    } catch (err) {
      console.error(err);
    }
  },
  index: async (req, res, next) => {
    try {
      const allSubscribers = await Subscriber.find({});
      res.locals.subscribers = allSubscribers;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  indexView: (req, res) => {
    res.status(200).render("subscribers/index");
  },
  indexJson: (req, res) => {
    try {
      const { subscribers } = res.locals;
      res.status(200).json({ success: true, data: subscribers });
    } catch (err) {
      console.error(err);
    }
  },

  createNewSubscriber: async (req, res, next) => {
    const { zipCode, name, email } = req.body;

    try {
      const newSubscriber = await Subscriber.create({
        name,
        email,
        zipCode
      });
      res.locals.newSubscriber = newSubscriber;
      res.locals.redirect = "/subscribers";
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },
  show: async (req, res, next) => {
    try {
      const { subscriberId } = req.params;
      const subscriber = await Subscriber.findById(subscriberId);
      res.locals.subscriber = subscriber;
      next();
    } catch (err) {
      next(err);
    }
  },
  showView: (req, res) => {
    res.status(200).render("subscribers/show");
  },
  edit: (req, res) => {
    res.status(200).render("subscribers/edit");
  },
  update: async (req, res, next) => {
    try {
      const { subscriberId } = req.params;
      const { name, zipCode, email } = req.body;
      const newDetails = {
        name,
        email,
        zipCode
      };
      const subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {
        $set: newDetails
      });
      res.locals.subscriber = subscriber;
      res.locals.redirect = `/subscribers/${subscriberId}`;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { subscriberId } = req.params;
      await Subscriber.findByIdAndRemove(subscriberId);
      res.locals.redirect = "/subscribers";
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};
