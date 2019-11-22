const neo4j = require('neo4j')
const db = new neo4j.GraphDatabase('http://neo4j:bitnami@neo4j:7474', (err, res) => {
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
  'green': [ 'ANGRIGNON', 'MONK', 'JOLICOEUR', 'VERDUN', "DE L'EGLISE", 'LASALLE', 'CHARLEVOIX', 'LIONEL-GROULX',
    'ATWATER', 'GUY-CONCORDIA', 'PEEL', 'MCGILL', 'PLACE-DES-ARTS', 'SAINT-LAURENT', 'BERRI-UQAM', 'BEAUDRY', 'PAPINEAU',
    'FRONTENAC', 'PREFONTAINE', 'JOLIETTE', 'PIE-IX', 'VIAU', 'ASSOMPTION', 'CADILLAC', 'LANGELIER', 'RADISSON',
    'HONORE-BEAUGRAND'  ],

  'yellow': [ 'LONGUEUIL–UNIVERSITE-DE-SHERBROOKE', 'JEAN-DRAPEAU', 'BERRI-UQAM'],
  'blue': [ 'SNOWDON', 'COTE-DES-NEIGES', 'UNIVERSITE-DE-MONTREAL',
    'EDOUARD-MONTPETIT', 'OUTREMONT', 'ACADIE',
    'PARC', 'DE CASTELNAU', 'JEAN-TALON', 'FABRE',
    "D'IBERVILLE", 'SAINT-MICHEL'
  ],
  'orange': [
    'COTE-VERTU', 'DU COLLEGE', 'DE LA SAVANE', 'NAMUR',
    'PLAMONDON', 'COTE-SAINTE-CATHERINE', 'SNOWDON', 'VILLA-MARIA',
    'VENDOME', 'PLACE-SAINT-HENRI', 'LIONEL-GROULX', 'GEORGES-VANIER',
    "LUCIEN-L'ALLIER", 'BONAVENTURE',
    'SQUARE-VICTORIA-OACI', "PLACE-D'ARMES",
    'CHAMP-DE-MARS', 'BERRI-UQAM', 'SHERBROOKE',
    'MONT-ROYAL', 'LAURIER', 'ROSEMONT', 'BEAUBIEN', 'JEAN-TALON',
    'JARRY', 'CREMAZIE', 'SAUVE', 'HENRI-BOURASSA',
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

// Clear up 
MATCH (r) DETACH DELETE r

See what we have:
MATCH (s1:Station)-[:connectsWith]->(s2:Station) RETURN *

MATCH yellowLine=(s1:Station {color:"yellow"})-[:connectsWith]->(s2:Station {color:"yellow"}) RETURN yellowLine
MATCH orangeLine=(s1:Station {color:"orange"})-[:]->(s2:Station {color:"orange"}) RETURN orangeLine

// First try ...
MATCH myCommute=(s1:Station {name:"BONAVENTURE"})-[*1..15]->(s2:Station {name:"CREMAZIE"}) RETURN myCommute

MATCH myCommute=(s1:Station {name:"BONAVENTURE"})-[*1..15]->(s2:Station {name:"CREMAZIE"}) WITH myCommute, length(myCommute) AS howManyStations  RETURN myCommute ORDER BY howManyStations ASC LIMIT 1


// Learning: a PATH has a Length

// Good, let's see how we can switch lines now:

MATCH myCommute=(s1:Station {name:"FRONTENAC"})-[*1..15]->(s2:Station {name:"CREMAZIE"}) WITH myCommute, length(myCommute) AS howManyStations  RETURN myCommute ORDER BY howManyStations ASC LIMIT 1


// Well that's because there are 2 berri-uqams that are not connected:

MATCH (s1:Station {name:"BERRI-UQAM"}), (s2:Station {name:"BERRI-UQAM"}) WHERE s1 <> s2 RETURN *


// Are they connected?
MATCH (s1:Station {name:"BERRI-UQAM"}), (s2:Station {name:"BERRI-UQAM"}) WITH s1, s2, (s1)-[*1..2]-(s2) AS path WHERE s1 <> s2 RETURN path
// Notice there ARE results because the "MATCH" worked, but there are no paths.


// Let's connect them.
See: MATCH (s1:Station), (s2:Station) WHERE s2 <> s1 AND s1.name = s2.name RETURN s1, s2 LIMIT 50

Merge: MATCH (s1:Station), (s2:Station) WHERE s2 <> s1 AND s1.name = s2.name MERGE (s1)-[:sharesBuildingWith {peak: 10, normal: 1}]->(s2) MERGE (s2)-[:sharesBuildingWith]->(s1)




// Good, let's see how we can switch lines now:

MATCH myCommute=(s1:Station {name:"FRONTENAC"})-[*1..15]->(s2:Station {name:"CREMAZIE"}) WITH myCommute, length(myCommute) AS howManyStations  RETURN myCommute ORDER BY howManyStations ASC LIMIT 1

// Come on, now is the moment for the applause :)

// Let's make it nicer
MATCH myCommute=shortestpath((s1:Station {name:"FRONTENAC"})-[*1..15]->(s2:Station {name:"CREMAZIE"})) RETURN myCommute 



// Let's try a few others just to know it was not by chance:


MATCH myRide = shortestPath((s1:Station {name:"ACADIE"})-[*1..20]-(s2:Station {name:"FRONTENAC"})) RETURN myRide


// Skip this one MATCH myRide = shortestPath((s1:Station {name:"BERRI-UQAM"})-[*1..20]->(s2:Station {name:"FRONTENAC"})) WITH myRide, LENGTH(myRide) as howManyStations RETURN myRide ORDER BY howManyStations DESC LIMIT 1

// The shortest path, with scores of how long it would be during peak hours and normal hours. But always the shortest path.

MATCH myRide = shortestPath((s1:Station {name:"ACADIE"})-[*1..20]->(s2:Station {name:"FRONTENAC"})) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY howDepth ASC


// And order by the time it takes?

MATCH myRide = shortestPath((s1:Station {name:"ACADIE"})-[*1..20]->(s2:Station {name:"FRONTENAC"})) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY peak ASC


// The reason why it's the same time is because we're FORCING the shortest path (so as little stations as possible)


MATCH myRide = (s1:Station {name:"ACADIE"})-[*1..25]->(s2:Station {name:"FRONTENAC"}) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY peak ASC LIMIT 1

// It seems like it takes the same time. Let's change the time it takes to switch lines at BERRI UQAM

MATCH (orange:Station {name:"BERRI-UQAM"})-[connectionTime:sharesBuildingWith]->(green:Station {name:"BERRI-UQAM"})
SET connectionTime.peak = 100




// Check the ride now! I should get a new route


MATCH myRide = (s1:Station {name:"ACADIE"})-[*1..25]->(s2:Station {name:"FRONTENAC"}) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY peak ASC LIMIT 1


// Pretend the green line is is broken now

MATCH path=(s1:Station {name:"ATWATER"})-[connectionTime:connectsWith *1..5]->(s2:Station {name:"MCGILL"})
FOREACH (r IN relationships(path) | SET r.peak = 40)

// Try again


MATCH myRide = (s1:Station {name:"ACADIE"})-[*1..25]->(s2:Station {name:"FRONTENAC"}) 
WITH myRide, length(myRide) as howDepth, relationships(myRide) AS rels
UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY peak ASC LIMIT 1


// Applauses!
// So now, what else can we do with this?

// Let's ask the system in which stations I might cross paths with a colleague . 
// I go from home to ssense. My colleague goes from lasalle to cremazie
// For the sake of simplicity I'll do it with shortest paths (so not based on peak hours)

MATCH 
  myRide = (s1:Station {name:"FRONTENAC"})-[*1..25]->(s2:Station {name:"CREMAZIE"}),
  theirRide = (s1:Station {name:"LASALLE"})-[*1..25]->(s2:Station {name:"CREMAZIE"})
WITH myRide, theirRide

UNWIND(rels) as unwondRels
RETURN myRide, howDepth, SUM(unwondRels.peak) AS peak, SUM(unwondRels.normal) AS normal ORDER BY peak ASC LIMIT 1





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
