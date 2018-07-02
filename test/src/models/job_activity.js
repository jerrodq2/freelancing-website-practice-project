'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const JobActivity = require(`${process.cwd()}/src/models/job_activity`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Job Activity Model', () => {

	describe('has a create method', () => {

	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id and freelancer_id', () => {

	});
});
