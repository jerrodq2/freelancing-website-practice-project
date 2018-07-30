'use strict';


const miscIds = require(`${process.cwd()}/seeds/ids/misc`);
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const FlaggedInvitations = require(`${process.cwd()}/src/models/flagged_invitations`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_invitations').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedInvitations.create({
			invitation_id: miscIds.loki_invitation,
			freelancer_who_flagged: freelancerIds.leon,
			reason: 'This is fake',
		}),
	]);

};
