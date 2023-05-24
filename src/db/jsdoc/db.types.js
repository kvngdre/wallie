import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * A function that generates a model class that extends Model.
 * @typedef ModelGenerator
 * @type {Function}
 * @param {Sequelize} sequelize - The sequelize instance
 * @param {DataTypes} DataTypes - Sequelize dataTypes class.
 * @return {Model} - A model class
 */

/**
 * @typedef DbObject
 * @type {Object}
 * @property {Sequelize} sequelize - The sequelize instance.
 * @property {typeof Sequelize} Sequelize - The Sequelize class.
 * @property {Array.<ModelGenerator>} modelGenerators - The model generators.
 * @property {Object.<string, Model>} models
 */
