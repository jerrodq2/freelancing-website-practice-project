'use strict';


const Skills = require(`${process.cwd()}/src/models/skills`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('skills').del();
	// Inserts seed entries
	return Promise.all([
		Skills.create('mean'),
		Skills.create('nodejs'),
		Skills.create('ruby on rails'),
		Skills.create('reactjs'),
		Skills.create('angularjs'),
		Skills.create('.net'),
		Skills.create('html'),
		Skills.create('css'),
		Skills.create('bootstrap'),
		Skills.create('jquery'),
		Skills.create('sql'),
		Skills.create('mysql'),
		Skills.create('analyst'),
		Skills.create('wordpress'),
	]);
};
