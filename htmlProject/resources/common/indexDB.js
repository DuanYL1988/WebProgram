class indexDb {
    constructor(){
        this.dbName = "IndexDB_local"
        this.dbVersion = 1
        this.storeName = "localWebApp"
        this.keyPathName = "objectKeyName"
        this.request = window.indexedDB.open(this.dbName,this.dbVersion)
        this.db = null
        this.resultData = {}
        
        this.request.onerror = (event) => {
            console.error("IndexDB Error:")
        }
        
        this.request.onsuccess = (event) => {
            console.log("Open IndexDB Success!")
            this.db = event.target.result
        }
        
        this.request.onupgradeneeded = (event) => {
            console.log("Open IndexDB OnUpGradeneeded!")
            this.db = event.target.result
            if(!this.db.objectStoreNames.contains(this.storeName)) {
                this.db.createObjectStore(this.storeName,{keyPath:this.keyPathName})
            }
        }
    }
    
    update(keyName,jsonData) {
        jsonData[this.keyPathName] = keyName
        
        let request = this.db.transaction([this.storeName],"readwrite")
            .objectStore(this.storeName)
            .delete(keyName)
            
        request = this.db.transaction([this.storeName],"readwrite")
            .objectStore(this.storeName)
            .add(jsonData)
            
        request.onsuccess = (event) => {
            console.log("do Update Success!")
            return true
        }
        
        request.onerror = (event) => {
            console.log("do Update Error!")
            return false
        }
    }
    
    getData(keyPath) {
        return this.db.transaction([this.storeName],"readwrite")
            .objectStore(this.storeName)
            .get(keyPath)
    }
    
    getRequestResult(keyPath){
        let request = this.db.transaction([this.storeName],"readwrite")
            .objectStore(this.storeName)
            .get(keyPath)
        
        request.onsuccess = (event) => {
            this.resultData = event.target.result
        }
    }

}
