"use strict";

import {TableDefinition, TableContext} from "./types-puntapie-inicial";

import { getPolicies } from "./table-ejemplo_noticias";

export function ejemplo_vinculos(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var redactor = context.user.rol==='redactor';
    var pol = getPolicies(context.be);
    return {
        name:'ejemplo_vinculos',
        elementName:'vínculo', 
        title:'vínculos', // solo si es distinto al "name", si es igual se puede omitir
        editable:admin || redactor,
        fields:[
            {name:'url'              , typeName:'text'    }, 
            {name:'orden'            , typeName:'bigint'  , nullable:false, specialDefaultValue:'next_number'},
            {name:'vinculo'          , typeName:'text'    , nullable:false},
        ],
        primaryKey:['url','vinculo'],
        foreignKeys:[
            {references:'ejemplo_noticias', fields:['url']}
        ],
        constraints:[
            {constraintType:'unique', fields:['url','vinculo']}
        ],
        sql:{
            policies:{
                all:{using:`(SELECT ${pol.all.using} FROM ejemplo_noticias WHERE url = ejemplo_vinculos.url)`},
                select:{using:`(SELECT ${pol.select.using} FROM ejemplo_noticias WHERE url = ejemplo_vinculos.url)`}
            }
        },
        sortColumns:[{column:'url', order:1},{column:'orden', order:1}]
    };
}
