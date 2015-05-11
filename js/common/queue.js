

function Queue() {

    this.processCallback = null;
    this.completedCallback = null;
    this.currIndex = null;
    
    this.items = new Array();
    this.start = function(processCallback, completedCallback) {
        if(processCallback != null) this.processCallback = processCallback;
        if(processCallback == null) throw 'process callback is not defined';
        if(completedCallback != null) this.completedCallback = completedCallback;
        this.currIndex = -1;
        this.continue();
    }

    
    this.continue = function() {
        var item = this._getNextItemFromQueue();
        if(item == null) {
            if(this.completedCallback != null) {
                this.completedCallback();
            }
        } else {
            this.processCallback(item);
        }
    }
    
    
    // Get first item availabe from queue to be processed
    this._getNextItemFromQueue = function() {
        return (++this.currIndex < this.items.length) ?
                                                this.items[this.currIndex] : 
                                                null;
    }
    
}






var queue = new Queue();
// Prepare the queue
queue.items = [
    "create table if not exists * from ...",
    "insert * from ...",
    "select * from ..."
];
// Start process
queue.start(function(item) {
    
    // Process item function
    alert('processing ' + item);
    
    // do something async...
    queue.continue();
    
}, function() {
    alert('completed');
});
// TODO Testing data.hope()

console.log(queue);