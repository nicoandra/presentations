const neo4j = require('neo4j')
const db = new neo4j.GraphDatabase('http://neo4j:bitnami@localhost:7474', (err, res) => {
  console.log('eee')
  if (err) {
    console.err(err)
    return
  }
})

/*****
db.cypher('CREATE (a: {name:"Berri-UQAM", color:"orange"})', (err, res) => {
console.log(err, res)})
db.cypher('CREATE (a: {name:"Berri-UQAM", color:"yellow"})', (err, res) => {
console.log(err, res)})
db.cypher('CREATE (a: {name:"Berri-UQAM", color:"green"})', (err, res) => {
console.log(err, res)})
******/

const lines = {
  'green': [ 'ANGRIGNON', 'MONK', 'JOLICOEUR', 'VERDUN', "DE L'ÉGLISE", 'LASALLE', 'CHARLEVOIX', 'LIONEL-GROULX',
    'ATWATER', 'GUY-CONCORDIA', 'PEEL', 'MCGILL', 'PLACE-DES-ARTS', 'SAINT-LAURENT', 'BERRI-UQAM', 'BEAUDRY', 'PAPINEAU',
    'FRONTENAC', 'PRÉFONTAINE', 'JOLIETTE', 'PIE-IX', 'VIAU', 'ASSOMPTION', 'CADILLAC', 'LANGELIER', 'RADISSON',
    'HONORÉ-BEAUGRAND'  ],

  'yellow': [ 'LONGUEUIL–UNIVERSITÉ-DE-SHERBROOKE', 'JEAN-DRAPEAU', 'BERRI-UQAM'],
  'blue': [ 'SNOWDON', 'CÔTE-DES-NEIGES', 'UNIVERSITÉ-DE-MONTRÉAL',
    'ÉDOUARD-MONTPETIT', 'OUTREMONT', 'ACADIE',
    'PARC', 'DE CASTELNAU', 'JEAN-TALON', 'FABRE',
    "D'IBERVILLE", 'SAINT-MICHEL'
  ],
  'orange': [
    'CÔTE-VERTU', 'DU COLLÈGE', 'DE LA SAVANE', 'NAMUR',
    'PLAMONDON', 'CÔTE-SAINTE-CATHERINE', 'SNOWDON', 'VILLA-MARIA',
    'VENDÔME', 'PLACE-SAINT-HENRI', 'LIONEL-GROULX', 'GEORGES-VANIER',
    "LUCIEN-L'ALLIER", 'BONAVENTURE',
    'SQUARE-VICTORIA-OACI', "PLACE-D'ARMES",
    'CHAMP-DE-MARS', 'BERRI-UQAM', 'SHERBROOKE',
    'MONT-ROYAL', 'LAURIER', 'ROSEMONT', 'BEAUBIEN', 'JEAN-TALON',
    'JARRY', 'CRÉMAZIE', 'SAUVÉ', 'HENRI-BOURASSA',
    'CARTIER', 'DE LA CONCORDE', 'MONTMORENCY']
}

const delays = {
  'green': {
    'tbs': { 'peak': 5, 'normal': 2}
  },
  'yellow': {
    'tbs': { 'peak': 1, 'normal': 10}
  },
  'blue': {
    'tbs': { 'peak': 3, 'normal': 1}
  },
  'orange': {
    'tbs': { 'peak': 3, 'normal': 1}
  }
}

const s = Object.keys(lines).map((lineColor) => {
  return lines[lineColor].reduce((accumulated, current, index) => {
    const { peak, normal } = delays[lineColor].tbs

    const stationNode = '(s' + index + ':Station {name: "' + current + '", color:"' + lineColor + '"})'
    const connectsWith = '[:connectsWith {peak: ' + peak + ', normal: ' + normal + '}]'

    accumulated.create += (accumulated.create == '' ? 'CREATE ' : ', ') + stationNode
    const merge = '(s' + (index - 1) + ')-' + connectsWith + '->(s' + index + ') MERGE (s' + (index - 1) + ')<-' + connectsWith + '-(s' + index + ') '
    accumulated.merge += (index === 0 ? 'MERGE ' : (index === 1 ? '' : ' MERGE ') + merge)

    return accumulated
  }, { create: '',merge: ''})
})

s.forEach((a) => {
  const query = a.create + ' ' + a.merge
  db.cypher(query, (err, res) => {
    console.log(query, err, res)
  })
})

/*

Relate those that are in the same building

See: MATCH (s1:Station), (s2:Station) WHERE s2 <> s1 AND s1.name = s2.name RETURN s1, s2 LIMIT 50

Merge: MATCH (s1:Station), (s2:Station) WHERE s2 <> s1 AND s1.name = s2.name MERGE (s1)-[:sharesBuildingWith]->(s2) MERGE (s2)-[:sharesBuildingWith]->(s1)

 

MATCH myRide = shortestPath((s1:Station {name:"DE CASTELNAU"})-[*1..20]-(s2:Station {name:"FRONTENAC"})) RETURN myRide

MATCH myRide = shortestPath((s1:Station {name:"BERRI-UQAM"})-[*1..20]->(s2:Station {name:"FRONTENAC"})) WITH myRide, LENGTH(myRide) as howManyStations RETURN myRide ORDER BY howManyStations DESC LIMIT 1

MATCH myRide = shortestPath((s1:Station {name:"BERRI-UQAM"})-[*1..20]->(s2:Station {name:"LIONEL-GROULX"})) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak), SUM(unwondRels.normal) ORDER BY howDepth ASC

MATCH greenLinks = (s1:Station {color:"green"})-[r:connectsWith]->(s2:Station {color:"green"})
FOREACH (r in relationships(greenLinks) | SET r.peak = 22, r.normal = 2)

MATCH myRide = shortestPath((s1:Station {name:"BERRI-UQAM"})-[*1..20]->(s2:Station {name:"LIONEL-GROULX"})) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS timeDuringPeakHours, SUM(unwondRels.normal) AS timeDuringNormalHours ORDER BY howDepth ASC

MATCH myRide = shortestPath((s1:Station {name:"BEAUDRY"})-[*1..20]->(s2:Station {name:"CHARLEVOIX"})) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS timeDuringPeakHours, SUM(unwondRels.normal) AS timeDuringNormalHours ORDER BY howDepth ASC

*** Will ask to switch to the orange line
MATCH myRide = (s1:Station {name:"BEAUDRY"})-[*1..20]->(s2:Station {name:"CHARLEVOIX"})
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peaks, SUM(unwondRels.normal) AS normal ORDER BY peaks ASC , howDepth ASC LIMIT 10

*/
