<!--
To run this presentation, please run:

./node_modules/.bin/reveal-md graphdb-demo/index.md -w --theme blood
-->

<style>

span.highlight, .reveal em {
  color: #9c2232;
  font-weight: bold
}

.reveal code {
  color: #9c2232;
}

.reveal {
  font-size: 35px
}

.reveal h1 {
  font-size: 2.7em
}

.reveal h2 {
  font-size: 1.7em
}

.reveal h3 {
  font-size: 1.2em
}
</style>

# Graph databases
## Neo4j

Quick intro with a few examples 

---

## Who am I?
* Nicolás Andrade, Tech Lead of the Stash team
* Former Tech Lead for multiple High-traffic top-100 websites
* Former Code Auditor in Information Security
* Have been working at SSENSE for around 2 years (Joined November 21st 2017)

---

## Disclaimer

I am not an expert on this subject. I'd consider myself amateur on graph theory and graph databases. This presentation might include mistakes, errors, anti-patterns and similar bad practices.

---

# Graph theory

---
In mathematics, **Graph theory** is the study of graphs, which are mathematical structures used to model pairwise relations between objects.

A graph in this context is made up of vertices (also called nodes or points) which are connected by edges (also called links or lines).

----

## Nodes and edges

Made up of **nodes** which are connected by **edges**
<img src="/media/one.png" style="max-width: 80%">

----


## Nodes and edges are database entities

* They are first-cass citizens of a graph database.
* They all have an ID, and might have a name and other properties.
* The attributes of the nodes and edges are schema-less. Think of them as documents.


----

## Have you used graph databases before?

### Have you ever used ...

* IMDB?
* Facebook?
* LinkedIn?
* Any airline website?
* The internet?
* Google Maps?

----

## IMDB

<img src="/media/movies.jpg" style="max-width: 80%">

Note: can you spot the nodes and the edges?
---

## Facebook

<img src="/media/socialgraph.png" style="max-width: 80%">

---

## LinkedIn

<img src="/media/linkedin.png" style="max-width: 80%">

---

## Airports

<img src="/media/brazil.jpg" style="max-width: 80%">

---

## The Internet

<img src="/media/internet.jpg" style="max-width: 80%">

---

## Google Maps

<img src="/media/googlemaps.png" style="max-width: 80%">

----

## Montréal Metro

<img src="/media/plan-metro.jpg" style="max-width: 80%">
----

## A trip planner for Montréal Métro

* **Stations** will be **nodes**.
* Stations have 2 properties: *name* and *color*.

* The tunnels that connects two stations are the **edges**.
* The tunnels have 2 properties: *peakHours* and *normalHours*; used to store how fast (or slow) these tunnels are.

Note: Stateful is like a phone call. You open a connection and both parties know who they are talking to.
Stateless is a letter sent by mail. The envelope says who is the sender and who is the receiver. But no other context information.

----
## A trip planner for Montréal Métro

* The stations that exists in two lines at the same time (like Berri-UQÀM and Jean-Talon) are two different stations, one for each line.
* Stations having the same name but different color are connected through the stairs. These stairs are also **edges**.
* The stairs can have two properties: *peakHours* and *normalHours*; used to store how fast (or slow) the transit is.

----
## A trip planner for Montréal Métro

* It does not matter what *peakHours* and *normalHours* mean. We'll use an arbitrary number.
* We can consider the number as _speed_, so the higher the number the faster the route is;
* We we can consider the number as _crowded_, so the more crowded a route is, the slower the traffic is.

----

## Some syntax

A node is represented as in ASCII Art:

```
(nodeName:nodeClass { nodeProperty: propertyValue})
```

## Some syntax

A link is also as in ASCII Art:

```
(:Employee { name: "Bernard"})-[link1:MEMBER_OF_TEAM {since:"January 2018"}]->(:Team {name: "Stash"})
```

---

## The query language

`MATCH` is used as some kind of `SELECT`
`MERGE` and `CREATE` are used as some sort of `INSERT` and `UPDATE``

But to be honest there's no one-to-one mapping. You'll need to destructure yourself and switch to a graph mindset!

---

## Hands on, create the map!

```
docker-compose up neo4j ;
docker-compose up node ;
```

* Visit http://127.0.0.1:7474
* Connect as `neo4j`, `bitnami`

---

## Quick summary

* We've learned to `MATCH` nodes and patterns.
* We've learned a few query keywords, such as `FOREACH`, `SET`, `RETURN`, `WITH` and `UNWIND`
* We've learned ask the database engine to find the existing patterns

---

## What is still pending?

* Once the computer recognized a pattern, can it show me the missing pieces to build new patterns?

Used in recommendation engines. The "Suggested friends" Facebook feature does this.

---


## Which are some creative uses of this?

* Defining a pipeline, as individual steps (nodes) that forward to other steps (nodes) through links:

`(step1)-[:on success call]->(step2)`

---
### Resources

* https://neo4j.com/ - Graph Database
* https://github.com/nicoandra/presentations/ - The sources

---

### Thanks for attending!
