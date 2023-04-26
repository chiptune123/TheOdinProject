const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//Virtual to get author's full name
AuthorSchema.virtual("getFullName").get(function () {
  let fullname = "";
  // if author doesn't has either first name or family name will return an empty string
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

//Virtual to return the absolute url of specific author
AuthorSchema.virtual("getAuthorUrl").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function(){
  if(!this.date_of_birth){
    return "";
  }
  return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
})

AuthorSchema.virtual("date_of_death_formatted").get(function(){
  if(!this.date_of_death){
    return "";
  }
  else{
    return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }
})

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
