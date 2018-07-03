'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);



describe('Proposals Model', () => {

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
});
