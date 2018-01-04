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

const EvidenceModel = db.define('evidence', {
  description: { type: Sequelize.STRING }
})

BeliefModel.hasMany(EvidenceModel)
EvidenceModel.belongsTo(BeliefModel)

const AlternativeModel = db.define('alternative', {
  description: { type: Sequelize.STRING }
})

BeliefModel.hasMany(AlternativeModel)
AlternativeModel.belongsTo(BeliefModel)

const ImplicationModel = db.define('implication', {
  description: { type: Sequelize.STRING }
})

BeliefModel.hasMany(ImplicationModel)
ImplicationModel.belongsTo(BeliefModel)

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AdversityModel.create({
      description: casual.sentences(1)
    }).then((adversity) => {
      return adversity.createBelief({
        description: casual.sentences(1),
      }).then(belief => Promise.all([
        belief.createEvidence({description: casual.sentences(1)}),
        belief.createAlternative({description: casual.sentences(1)}),
        belief.createImplication({description: casual.sentences(1)})
      ]))
    });
  });
});

const Adversity = db.models.adversity;
const Belief = db.models.belief;

export { Adversity, Belief };