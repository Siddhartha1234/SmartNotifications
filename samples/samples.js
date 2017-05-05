/**
 * Created by sid on 5/5/17.
 */
const notification_samples = [ 'You have a job offer' , 'Check out this article!', "See this user's updated profile" , "This user has accepted your connect request"];

function random_notification() {
    return notification_samples[Math.floor(Math.random()*4)];
}

function random_notification_array(size) {
    var notfs = []
    for(var i = 0; i < size ; i++)
    {
        if(i == size)
            return notfs;
        else {
            notfs.push(notification_samples[Math.floor(Math.random()*4)]);
        }
    }

}

module.exports.random_notification = random_notification;
module.exports.random_notification_array = random_notification_array;
