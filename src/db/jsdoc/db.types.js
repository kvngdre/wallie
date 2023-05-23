import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * A function that generates a model class that extends Model.
 * @typedef {Function} ModelGenerator
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return {Model} A model class
 */

/**
 * @typedef {Object} DbObject
 * @property {Sequelize} sequelize The sequelize instance.
 * @property {typeof Sequelize} Sequelize The Sequelize class.
 * @property {ModelGenerator[]} modelGenerators
 * @property {Object.<string, Model>} models
 */
