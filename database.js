let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const { Schema } = mongoose;

const server = "localhost:3000"; // REPLACE WITH YOUR DB SERVER
const database = "Cluster0"; // REPLACE WITH YOUR DB NAME

//create a person model
let Person;
  const personSchema = new Schema ({
    name:  { type: String, required: true }, // String is shorthand for {type: String}
    author: String,
    age:   Number,
    favoriteFoods: [String]
});

//create and save a person
Person = mongoose.model("Person", personSchema);

let createAndSavePerson = function (done) {
  const marioBa = new Person({
    name: "Mario Balotelli",
    age: 32,
    favoriteFoods: ["eggs", "fish", "fresh fruit"],
  });

  marioBa.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

//create many people
const arrayOfPeople = [
  {
    name: "Jean Paul",
    age: 64,
    favoriteFoods: ["eggs", "fish", "chocolate"],
  },
  {
    name: "Vera Song",
    age: 90,
    favoriteFoods: ["beans", "meat", "banana"],
  },
  {
    name: "Bruce Willis",
    age: 4,
    favoriteFoods: ["candy", "porridge", "milk"],
  }
]
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, People) => {
    if(err) return console.error(err);
    done(null , People);
  });
};

//find one person
const findOneByFood = (food, done) => {
  Person.findOne ({favoriteFoods: food}, (err, data) => {
    if(err) return console.log(err);
    done(null, data);
  });
};

//find person id (personId)
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if(err) return console.log(err)
   done(null , data);   
  })
};

//find edit and save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  //.findById() method to find a person by _id with the parameter personId as search key. 
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err)
    // Array.push() method to add "hamburger" to the list of the person's favoriteFoods.
  person.favoriteFoods.push(foodToAdd);
    // and inside the find callback - save() the updated Person.
    person.save((err, updatedPerson) => {
      if(err) return console.error(err)
        done(null , updatedPerson);
    });       
  });
};

//find one person and and update age
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, { new: true}, (err, updatedDoc) => {
    if(err) return console.log(err)
    done(null, updatedDoc);
  });
};

//delete many
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console,log(err)
    done(null, response);
  });
};
//
const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, people) => {
      if (err) return console.log(err);
      done(nill, people);
    });
};



module.exports = new Database();
