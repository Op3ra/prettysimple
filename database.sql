-- Populate tables

-- Users
insert into "user"(id, name) values ('3058955c-f535-4ebf-aca4-3153ce3d9bc7', 'Alice');
insert into "user"(id, name) values ('9997048b-36ab-465e-a265-84c1635fe610', 'Mary');
insert into "user"(id, name) values ('bf823eca-da07-4417-825d-1bdd82f2aa15', 'George');
insert into "user"(id, name) values ('1c5335fc-286f-4e5b-accc-91bd0e569ba2', 'Henry');
insert into "user"(id, name) values ('bb0e9186-00b2-4415-b803-99dc3e4909ea', 'Marge');
insert into "user"(id, name) values ('3a711435-04a1-47ff-abfa-7d8fa3b5f8c4', 'Homer');

-- Cities
insert into city(id, name, mayor_id) values ('c16b60d4-821e-4e8a-be9b-713185a26910', 'New York', '3058955c-f535-4ebf-aca4-3153ce3d9bc7');
insert into city(id, name, mayor_id) values ('7e46ceec-68d6-42b3-befb-a7f126537f4f', 'Paris', '9997048b-36ab-465e-a265-84c1635fe610');
insert into city(id, name, mayor_id) values ('df81220f-ee83-4a8c-b842-e76e8cea9163', 'La Paz', 'bf823eca-da07-4417-825d-1bdd82f2aa15');
insert into city(id, name, mayor_id) values ('11ff9772-9a21-4ddb-a4ed-dd7ba6404df4', 'London', '1c5335fc-286f-4e5b-accc-91bd0e569ba2');
insert into city(id, name, mayor_id) values ('aab5faa6-a3af-4348-b357-1e00cccbd70c', 'Dakar', 'bb0e9186-00b2-4415-b803-99dc3e4909ea');
insert into city(id, name, mayor_id) values ('17c5a2e8-2e08-47c1-b026-295a3a24215c', 'Tokyo', '3a711435-04a1-47ff-abfa-7d8fa3b5f8c4');
