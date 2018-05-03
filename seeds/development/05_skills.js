'use strict';


const Skills = require(`${process.cwd()}/src/models/skills`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('skills').del();
	// Inserts seed entries
	return Promise.all([
		Skills.create({ skill: 'mean' }),
		Skills.create({ skill: 'nodejs' }),
		Skills.create({ skill: 'ruby on rails' }),
		Skills.create({ skill: 'reactjs' }),
		Skills.create({ skill: 'angularjs' }),
		Skills.create({ skill: '.net' }),
		Skills.create({ skill: 'html' }),
		Skills.create({ skill: 'css' }),
		Skills.create({ skill: 'bootstrap' }),
		Skills.create({ skill: 'jquery' }),
		Skills.create({ skill: 'sql' }),
		Skills.create({ skill: 'mysql' }),
		Skills.create({ skill: 'analyst' }),
		Skills.create({ skill: 'wordpress' }),
	]);
};
