class ProjectsHistory {

    constructor(){
        this._data = [];
        this._sizeLimit = 10; //or -1
        this._size = 0;
    }

    _newProjectNode(path,base){
        return {
            path:path,
            base:base
        }
    }

    _checkAndSetStructure(){
        // TODO
        // if directory does not exist remove the object
        // if the object does not exist but directory yes, create the object
    }

    empty(){
        return (this._size===0);
    }

    size(){
        return this._size;
    }

    get(index){
        if(this._size<1) return null;
        if(!_.isInteger(index)) return null;
        else if(index===-1) index=this._size-1;
        else if(index>this._size-1) return null;
        return this._data[index].path;
    }

    add(project_path){
        let project_name = Utils.File.pathBasename(project_path);
        if(!_.isString(project_name) || project_name.length<1) return false;
        this.remove(project_path);
        this._data.unshift(this._newProjectNode(project_path,project_name));
        if(this._sizeLimit>0 && this._data.length>this._sizeLimit) this._data.splice(this._sizeLimit);
        this._size = this._data.length;
        return true;
    }

    getIndex(project_path){
        project_path = _.toLower(project_path);
        for(let i=0; i<this._data.length; i++){
            if(_.toLower(this._data[i].path) === project_path){
                return i;
            }
        }
        return -1;
    }

    remove(project_path){
        let index = this.getIndex(project_path);
        if(index<0) return false;
        this._data.splice(index,1);
        return true;
    }


    printIndexedList(printFn){
        printFn('');
        printFn('Available projects:');
        for(let i=0; i<this._data.length; i++){
            printFn('  ' + (i+1) + ') ' + this._data[i].path);
        }
        printFn('');
        return this._data.length>0;
    }


    forEach(cb){
        for(let i=0; i<this._data.length; i++){
            cb(this._data[i],i);
        }
    }


    fromJson(jsondata){
        if(!_.isObject(jsondata)) return false;
        this._checkAndSetStructure();
        this._data = [];
        this._sizeLimit = jsondata.sizelimit;
        jsondata.collection.forEach((value)=>{
            this._data.push(this._newProjectNode(value.path,value.base));
        });
        this._size = this._data.length;
        return true;
    }


    toJson(){
        this._checkAndSetStructure();
        return {
            size:this._size,
            sizelimit:this._sizeLimit,
            collection:this._data
        };
    }
}

module.exports = ProjectsHistory;