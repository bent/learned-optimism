import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

const db = new Sequelize('learned-optimism', null, null, {
  dialect: 'sqlite',
  storage: './learned-optimism.sqlite',
});

const AdversityModel = db.define('adversity', {
  description: { type: Sequelize.STRING }
});

const BeliefModel = db.define('belief', {
  description: { type: Sequelize.STRING }
});

AdversityModel.hasMany(BeliefModel);
BeliefModel.belongsTo(AdversityModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AdversityModel.create({
      description: casual.sentences(1)
    }).then((adversity) => {
      return adversity.createBelief({
        description: casual.sentences(1),
      });
    });
  });
});

const Adversity = db.models.adversity;
const Belief = db.models.belief;

export { Adversity, Belief };