
const ENUMS = {
    datatype: {
        integer:1,
        number:2,
        boolean:3,
        char:4,
        string:5,
        array:6,
        object:7,
        reldirpath:8,
        relfilepath:9,
        absdirpath:10,
        absfilepath:11
    },
    checks:{
        success:21,
        wrongValue:22,
        wrongObjectValue:23,
        valueNotAllowed:24,
        pathNotExists:25,
        labelNeeded:26,
        parseValueNotString:27,
        parsingFailed:28,
        parsingIncompleteEnd:29,
        parsingDifferentDataField:30
    }
};


class ConfigField {
    constructor(field_cfg){

        this._field_cfg = null;
        this._value = null;

        let fcfg = _.merge({
            fieldname:'',
            description:'',
            datatype: 'string',
            objectDatatype: null,
            defaultValue: null,
            allowedValues: [],
            flagsOnChange: null,
            customFn:{
                /* exampleFn:function(v,dt) v=current value, dt={} object for data - return undefined to avoid set*/
            },

            printErrorFn:null,
            checkFn: null,
            checkObjectFn: null,
            checkPathExists: false, //only for path

            setSuccessFn: null,

            // datatypeCode - integer, set privately
            // objectDatatypeCode  - integer, set privately
            // setFn: null,  - function, set privately

        },field_cfg);

        let _self = this;

        if(!_.isFunction(fcfg.printErrorFn)) fcfg.printErrorFn=console.log;

        if(!this._setDatatype(fcfg.datatype, fcfg.objectDatatype, fcfg)) return;

        fcfg.checkObjectFn = this._setCheckFn(fcfg.checkObjectFn, fcfg.objectDatatypeCode, fcfg);
        fcfg.checkFn = this._setCheckFn(fcfg.checkFn, fcfg.datatypeCode, fcfg, fcfg.checkObjectFn);

        this.dataType = this._setDataTypeCheck(fcfg.datatypeCode);
        this.objectDatatype = this._setDataTypeCheck(fcfg.objectDatatypeCode);

        if(!fcfg.checkFn) return;

        this._field_cfg = fcfg;
        fcfg.setFn = this._setSetFn(fcfg.checkFn, fcfg.checkObjectFn, fcfg);

        if(!this.set(fcfg.defaultValue)){
            d$('ConfigField.constructor','invalid default value',fcfg.defaultValue);
            this._value = null;
            this._field_cfg = null;
            return;
        }
    }

    _setDataTypeCheck(datatypeCode){
        return {
            isInteger: (datatypeCode===ENUMS.datatype.integer),
            isNumber: (datatypeCode===ENUMS.datatype.number),
            isBoolean: (datatypeCode===ENUMS.datatype.boolean),
            isChar: (datatypeCode===ENUMS.datatype.char),
            isString: (datatypeCode===ENUMS.datatype.string),
            isArray: (datatypeCode===ENUMS.datatype.array),
            isObject: (datatypeCode===ENUMS.datatype.object),
            isRelDirPath: (datatypeCode===ENUMS.datatype.reldirpath),
            isRelFilePath: (datatypeCode===ENUMS.datatype.relfilepath),
            isAbsDirPath: (datatypeCode===ENUMS.datatype.absdirpath),
            isAbsFilePath: (datatypeCode===ENUMS.datatype.absfilepath),
            isRelPath: ((datatypeCode===ENUMS.datatype.reldirpath) || (datatypeCode===ENUMS.datatype.relfilepath)),
            isAbsPath: ((datatypeCode===ENUMS.datatype.absdirpath) || (datatypeCode===ENUMS.datatype.absfilepath)),
            isPath: (   (datatypeCode===ENUMS.datatype.absdirpath) || (datatypeCode===ENUMS.datatype.absfilepath) ||
                        (datatypeCode===ENUMS.datatype.reldirpath) || (datatypeCode===ENUMS.datatype.relfilepath)),
        };
    }

    error(){
        return (this._field_cfg===null || this._value===null);
    }


    get(){
        return this._value;
    }

    set(v, addt, parse){
        if(parse===true){
            let parsed_v =this._parseValue(v);
            if(_.isNil(parsed_v)) return false;
            v = parsed_v;
        }
        let vObj = this._field_cfg.setFn(v, addt, this._value, this._field_cfg.allowedValues);
        if(_.isNil(vObj.v) || vObj.check!==ENUMS.checks.success){
            this._printError(v, vObj.check);
            return false;
        }
        this._value = vObj.v;
        if(this._field_cfg.setSuccessFn) this._field_cfg.setSuccessFn();
        return true;
    }

    fnSet(){
        return this._field_cfg.fnSet;
    }

    customFn(fnName){
        return this._field_cfg.customFn[fnName];
    }

    _parseValue(strvalue){
        if(_.isArray(strvalue)){
            if(this.dataType.isArray===true){
                let newarray = [];
                strvalue.forEach((v)=>{
                    let outcome_value = this._parseSingleValue(v, this._field_cfg.objectDatatypeCode);
                    if(!_.isNil(outcome_value)){
                        newarray.push(outcome_value);
                    }
                });
                if(strvalue.length !== newarray.length){
                    this._printError(strvalue, ENUMS.checks.parsingIncompleteEnd);
                    return null;
                }
                return newarray;
            }
            this._printError(strvalue, ENUMS.checks.parsingDifferentDataField);
            return null;
        }

        if(this.dataType.isObject===true || this.dataType.isArray===true){
            // parse internal data type for complex field
            return this._parseSingleValue(strvalue, this._field_cfg.objectDatatypeCode);
        }

        // parse simple data for simple field
        return this._parseSingleValue(strvalue, this._field_cfg.datatypeCode);
    }


    _parseSingleValue(strvalue, datatypeCode){
        if(!_.isString(strvalue)){
            this._printError(strvalue, ENUMS.checks.parseValueNotString);
            return null;
        }
        let outcome = null;

        if(datatypeCode === ENUMS.datatype.integer){
            outcome = Utils.strToInteger(strvalue);

        }else if(datatypeCode === ENUMS.datatype.number){
            outcome = Utils.strToFloat(strvalue);

        }else if(datatypeCode === ENUMS.datatype.boolean){
            outcome = Utils.strToBoolean(strvalue);

        }else{
            outcome = strvalue;
        }
        if(_.isNil(outcome)){
            this._printError(strvalue, ENUMS.checks.parsingFailed);
        }
        return outcome;
    }


    allowedValues(){
        if(!_.isArray(this._field_cfg.allowedValues) || this._field_cfg.allowedValues.length<1) return null;
        return this._field_cfg.allowedValues;
    }

    flagsOnChange(){
        if(!_.isArray(this._field_cfg.flagsOnChange) || this._field_cfg.flagsOnChange.length<1) return null;
        return this._field_cfg.flagsOnChange;
    }


    _setDatatype(datatype, objectDatatype, _fcfg){
        if(!ENUMS.datatype[datatype]){
            d$('_setDatatype: no valid datatype',datatype);
            return null;
        }
        let object_datatype_code = null;
        let datatype_code = ENUMS.datatype[datatype];
        if(datatype_code===ENUMS.datatype.array){
            if(!ENUMS.datatype[objectDatatype]){
                d$('_setDatatype: no valid objectDatatype',objectDatatype);
                return null;
            }
            object_datatype_code = ENUMS.datatype[objectDatatype];
            if(object_datatype_code === ENUMS.datatype.array) {
                d$('_setDatatype: objectDatatype cannot be array!');
                return null;
            }
        }
        if(_fcfg){
            _fcfg.datatype = datatype;
            _fcfg.objectDatatype = objectDatatype;
            _fcfg.datatypeCode = datatype_code;
            _fcfg.objectDatatypeCode = object_datatype_code;
            return true;
        }
        return {
            datatype:datatype,
            objectDatatype:objectDatatype,
            datatypeCode: datatype_code,
            objectDatatypeCode:object_datatype_code
        }
    }


    _setCheckFn(checkFn, datatypeCode, _fcfg, _checkObjectFn){
        if(!datatypeCode) return null;
        if(!_.isFunction(checkFn)){
            switch(datatypeCode) {
                case ENUMS.datatype.integer:
                    checkFn = function(v){ return (_.isInteger(v)===true?ENUMS.checks.success:ENUMS.checks.wrongValue); };
                    break;
                case ENUMS.datatype.number:
                    checkFn = function(v){ return (_.isNumber(v)===true?ENUMS.checks.success:ENUMS.checks.wrongValue); };
                    break;
                case ENUMS.datatype.boolean:
                    checkFn = function(v){ return (_.isBoolean(v)===true?ENUMS.checks.success:ENUMS.checks.wrongValue); };
                    break;
                case ENUMS.datatype.char:
                    checkFn = function(v){ return ((_.isString(v) && v.length<=1)===true?ENUMS.checks.success:ENUMS.checks.wrongValue); };
                    break;
                case ENUMS.datatype.string:
                    checkFn = function(v){ return (_.isString(v)===true?ENUMS.checks.success:ENUMS.checks.wrongValue); };
                    break;
                case ENUMS.datatype.array:
                    if(!_.isFunction(_checkObjectFn)) {
                        return null;
                    }
                    checkFn = function(v){
                        if(!_.isArray(v)) return ENUMS.checks.wrongValue;
                        for(let i=0; i<v.length; i++){
                            if(_checkObjectFn(v[i]) === ENUMS.checks.wrongValue) return ENUMS.checks.wrongObjectValue;
                        }
                        return ENUMS.checks.success;
                    };
                    break;
                case ENUMS.datatype.object:
                    if(!_.isFunction(_checkObjectFn)) {
                        return null;
                    }
                    checkFn = function(v){
                        if(!_.isObject(v)) return ENUMS.checks.wrongValue;
                        for(let i=0; i<v.length; i++){
                            if(_checkObjectFn(v[i]) === ENUMS.checks.wrongValue) return ENUMS.checks.wrongObjectValue;
                        }
                        return ENUMS.checks.success;
                    };
                    break;
                case ENUMS.datatype.reldirpath:
                    if(!_fcfg || !_fcfg.checkPathExists) checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isRelativePath(v)!==true) return ENUMS.checks.wrongValue;
                        return ENUMS.checks.success;
                    };
                    else checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isRelativePath(v)!==true) return ENUMS.checks.wrongValue;
                        if(Utils.File.directoryExistsSync(v)!==true) return ENUMS.checks.pathNotExists;
                        return ENUMS.checks.success;
                    };
                    break;
                case ENUMS.datatype.relfilepath:
                    if(!_fcfg || !_fcfg.checkPathExists) checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isRelativePath(v)!==true) return ENUMS.checks.wrongValue;
                        return ENUMS.checks.success;
                    };
                    else checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isRelativePath(v)!==true) return ENUMS.checks.wrongValue;
                        if(Utils.File.directoryExistsSync(v)!==true) return ENUMS.checks.pathNotExists;
                        return ENUMS.checks.success;
                    };
                    break;
                case ENUMS.datatype.absdirpath:
                    if(!_fcfg || !_fcfg.checkPathExists) checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isAbsolutePath(v)!==true) return ENUMS.checks.wrongValue;
                        return ENUMS.checks.success;
                    };
                    else checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isAbsolutePath(v)!==true) return ENUMS.checks.wrongValue;
                        if(Utils.File.directoryExistsSync(v)!==true) return ENUMS.checks.pathNotExists;
                        return ENUMS.checks.success;
                    };
                    break;
                case ENUMS.datatype.absfilepath:
                    if(!_fcfg || !_fcfg.checkPathExists) checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isAbsolutePath(v)!==true) return ENUMS.checks.wrongValue;
                        return ENUMS.checks.success;
                    };
                    else checkFn = function(v){
                        if(_.isString(v) && v.length===0) return ENUMS.checks.success;
                        if(Utils.File.isAbsolutePath(v)!==true) return ENUMS.checks.wrongValue;
                        if(Utils.File.directoryExistsSync(v)!==true) return ENUMS.checks.pathNotExists;
                        return ENUMS.checks.success;
                    };
                    break;
                default:
                    //should never happens
            }
        }
        return checkFn;
    }

    _getAllowedValuesFn(_fcfg){
        if(_fcfg.datatypeCode === ENUMS.datatype.array){
            return function(v, awv){
                if(!_.isArray(awv) || awv.length<=0) return ENUMS.checks.success;
                for(let i=0; i<v.length; i++){
                    if(awv.indexOf(v)<0) return ENUMS.checks.valueNotAllowed;
                }
                return ENUMS.checks.success;
            };
        }
        return function(v, awv){
            if(!_.isArray(awv) || awv.length<=0) return ENUMS.checks.success;
            if(awv.indexOf(v)>=0) return ENUMS.checks.success;
            return ENUMS.checks.valueNotAllowed;
        };
    }


    _setSetFn(checkFn, checkObjectFn, _fcfg){
        // addt = 'i', 'd', object key
        let allowedValuesFn = this._getAllowedValuesFn(_fcfg);

        let setFn = function(v, addt, _ref, awv){
            let vObj={ v:null, check:ENUMS.checks.success };

            vObj.check = checkFn(v);
            if(vObj.check !== ENUMS.checks.success) return vObj;

            vObj.check = allowedValuesFn(v, awv);
            if(vObj.check !== ENUMS.checks.success) return vObj;

            vObj.v = v;
            return vObj;
        };

        if(_fcfg.datatypeCode === ENUMS.datatype.array){
            setFn = function(v, addt, _ref, awv){
                let vObj={ v:null, check:ENUMS.checks.success };
                if(checkFn(v) === ENUMS.checks.success){
                    vObj.check = allowedValuesFn(v, awv);
                    if(vObj.check !== ENUMS.checks.success) return vObj;
                    if(_.isNil(addt)){
                        vObj.v = v;
                        return vObj;
                    }
                }else{
                    v = [v];
                    vObj.check = allowedValuesFn(v, awv);
                    if(vObj.check !== ENUMS.checks.success) return vObj;
                }
                if(addt==='i'){
                    for(let i=0; i<v.length; i++){
                        vObj.check = checkObjectFn(v[i]);
                        if(vObj.check !== ENUMS.checks.success){
                            if(vObj.check === ENUMS.checks.wrongValue) vObj.check=ENUMS.checks.wrongObjectValue;
                            return vObj;
                        }
                        _ref.push(v[i]);
                    }
                }
                else if(addt==='d'){
                    for(let i=0; i<v.length; i++){
                        let j = _ref.indexOf(v[i]);
                        if(j>=0) _ref.splice(j,1);
                    }
                }
                vObj.v = _ref;
                return vObj;
            };
        }
        else if(_fcfg.datatypeCode === ENUMS.datatype.object){
            setFn = function(v, addt, _ref, awv){
                if(checkFn(v) === ENUMS.checks.success){
                    vObj.v = v;
                    return vObj;
                }
                if(!_.isString(addt)){
                    vObj.check = ENUMS.checks.labelNeeded;
                    return vObj;
                }
                if(_.isNil(v)){
                    /* no value = delete key-value */
                    delete _ref[addt];
                    vObj.v = _ref;
                    return vObj;
                }

                vObj.check = checkObjectFn(v);
                if(vObj.check !== ENUMS.checks.success){
                    if(vObj.check === ENUMS.checks.wrongValue) vObj.check=ENUMS.checks.wrongObjectValue;
                    return vObj;
                }

                _ref[addt] = v;
                vObj.v = _ref;
                return vObj;
            };
        }
        return setFn;
    }



    _printError(fieldvalue, checkResult){
        switch(checkResult){
            case ENUMS.checks.wrongValue:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': wrong value',fieldvalue);
                break;
            case ENUMS.checks.wrongObjectValue:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': wrong value for internal objects',fieldvalue);
                break;
            case ENUMS.checks.valueNotAllowed:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': value not allowed',fieldvalue);
                this._field_cfg.printErrorFn('Allowed values:',this.allowedValues());
                break;
            case ENUMS.checks.pathNotExists:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': path does not exist',fieldvalue);
                break;
            case ENUMS.checks.labelNeeded:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': label needed for object parameter',fieldvalue);
                break;
            case ENUMS.checks.parseValueNotString:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': cannot parse a non-string value',fieldvalue);
                break;
            case ENUMS.checks.parsingFailed:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': parsing failed',fieldvalue);
                break;
            case ENUMS.checks.parsingIncompleteEnd:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': incomplete parsing - errors occurred on some fields',fieldvalue);
                break;
            case ENUMS.checks.parsingDifferentDataField:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': parsing failed - data type does not match with field',fieldvalue);
                break;
            default:
                this._field_cfg.printErrorFn(this._field_cfg.fieldname+': unknown error - '+checkResult,'value:',fieldvalue);
        }
    };



}


module.exports = ConfigField;
