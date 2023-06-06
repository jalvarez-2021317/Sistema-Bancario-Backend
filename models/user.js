const { Schema, model } = require('mongoose');

const userSchema = Schema({
    nombre:{
        type: String,
        require:[true,'The name is require']
    },

    userName:{
        type: String,
        require:[true , 'The nickname is require']
    },
    password:{
        type:String,
        require:[true, 'password is require']
    },
    
    NoCuenta:{
        type: Schema.Types.ObjectId,
        ref: 'Cuenta',
    },
    Dpi:{
        type: Number,
        requiere:[true,'Dpi is Require']
    },
    Celular:{
        type: Number,
        require:[true, 'Celular is require']
    },
    email:{
        type: String,
        require:[true,'Email is require']
    },

    NamefromWork:{
        type: String,
        
    },
    IngresosMensauales:{
        type: Number,
        require:[true, "Los ingresos son requeridos"]
    },
    role:{
        type: String,
        default : "User_rol"
    },
    estado:{
        type: Boolean,
        default: true
    },

})

module.exports = model('User', userSchema)