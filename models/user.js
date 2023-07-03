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
        requier:[true , "El nombre de trabajo es requerido"]
        
    },
    direccion:{
        type: String,
        require:[true, "La direccion es requerida"]
    }
    ,
    IngresosMensauales:{
        type: Number,
        requre:[true, "Los Ingresos mensuales son"]
    },
    role:{
        type: String,
        default : "USER_ROL"
    },
    estado:{
        type: Boolean,
        default: true
    },

})

module.exports = model('User', userSchema)