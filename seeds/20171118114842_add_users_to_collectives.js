exports.seed = (knex) => {
  const collectiveId = '00000000-0000-0000-0000-000000000000';

  return knex.transaction(trx =>
    knex('UsersCollectives').transacting(trx).del().where('collective_id', collectiveId)
      .then(() => knex('Users').select('id'))
      .then((users) =>
        Promise.all(users.map(user =>
          knex('UsersCollectives').transacting(trx)
            .insert({ user_id: user.id, collective_id: collectiveId })
        ))
        .then(() => knex('Collectives').where('id', collectiveId).transacting(trx)
        .update({ user_count: users.length })
      ))
    );
};
