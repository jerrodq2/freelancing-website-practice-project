'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedClients = require(`${process.cwd()}/src/models/saved_clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Saved Clients Model', () => {

	describe('has a create method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and client_id', () => {

	});
});
