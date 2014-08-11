// Constants
var pageUrl = 'http://www.allstate.com/';
var shareImage = 'http://localhost:63342/best_driver/code/img/home/share-thumbnail.jpg';
var cityShareCopy = '{city} is the {rank} safest driving city. See where your city ranks on America’s #BestDriversReport.';
var mapShareCopy = 'Is your city home to the best drivers in the U.S.? Allstate’s annual America’s #BestDriversReport has the answer.';

// Define an image media item:
var image = {
    type: 'image',
    src: shareImage,
    href: pageUrl
}

// Define a UserAction onject
var ua = new gigya.socialize.UserAction();
ua.setLinkBack(pageUrl);
ua.setTitle(mapShareCopy);
ua.setDescription(' ');
ua.addActionLink("Link", pageUrl);
ua.addMediaItem(image);

// Define Share Bar plugin's Parameters (Page Level)
var shareBarParams ={
    userAction:ua,
    shareButtons:
    [
        { // General Share Button
            provider:'share',
            tooltip:'Share Button',
            userMessage: mapShareCopy
        }
    ],
    containerID: 'pageShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(shareBarParams);

// Define a UserAction onject
var uaCity = new gigya.socialize.UserAction();
uaCity.setLinkBack(pageUrl);
uaCity.setTitle(cityShareCopy);
uaCity.setDescription(' ');
uaCity.addActionLink("Link", pageUrl);
uaCity.addMediaItem(image);

// Define Share Bar plugin's Parameters (City Level)
var cityShareBarParams = {
    userAction: uaCity,
    shareButtons:
    [
        { // General Share Button
            provider: 'share',
            tooltip: 'Share Button',
            userMessage: cityShareCopy,
        }
    ],
    containerID: 'cityShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(cityShareBarParams);

function setCityShare(city, rank) {
    var copy = cityShareCopy.replace('{city}', city);
    copy = copy.replace("{rank}", rank);
    copy = copy.replace(/<(?:.|\n)*?>/gm, '');
    uaCity.setTitle(copy);
}