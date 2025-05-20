import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    cartItems : {type: Object, default : {} },
}, {minimize : false})

// If the user model is already available then it will be used else it will be created 
// ✅ If the user model is already registered, use that (mongoose.models.user)
// ❌ If not, register it now using mongoose.model('user', userSchema)

const User = mongoose.models.user || mongoose.model('user' , userSchema);

/*
🧠 Is It Necessary?
        In a regular Node.js app:
            ❌ Not necessary if the schema is only loaded once.

        In Next.js, Remix, Vite SSR, serverless functions:
            ✅ Absolutely necessary to avoid the OverwriteModelError.
*/

export default User ;