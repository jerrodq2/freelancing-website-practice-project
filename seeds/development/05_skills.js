'use strict';


// This file seeds the database with starting skills
const Skills = require(`${process.cwd()}/src/services/skills/models/skills`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('skills').del();
	// Inserts seed entries
	return Promise.all([
		Skills.create({ skill: 'mean' }),
		Skills.create({ skill: 'nodejs' }),
		Skills.create({ skill: 'hapijs' }),
		Skills.create({ skill: 'ruby on rails' }),
		Skills.create({ skill: 'ruby' }),
		Skills.create({ skill: 'reactjs' }),
		Skills.create({ skill: 'angularjs' }),
		Skills.create({ skill: '.net' }),
		Skills.create({ skill: 'html' }),
		Skills.create({ skill: 'css' }),
		Skills.create({ skill: 'bootstrap' }),
		Skills.create({ skill: 'jquery' }),
		Skills.create({ skill: 'ajax' }),
		Skills.create({ skill: 'sql' }),
		Skills.create({ skill: 'mysql' }),
		Skills.create({ skill: 'mongodb' }),
		Skills.create({ skill: 'analyst' }),
		Skills.create({ skill: 'wordpress' }),
		Skills.create({ skill: 'database' }),
	]);
};
