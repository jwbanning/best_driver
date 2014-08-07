// Define an image media item:
var image = {
    type: 'image',
    src: 'http://localhost:63342/best_driver/code/img/home/share-thumbnail.jpg',
    href: 'http://www.allstate.com/'
}

// Define a UserAction onject
var ua = new gigya.socialize.UserAction();
ua.setLinkBack("http://www.allstate.com/");
ua.setTitle("America's Best Driver Report");
ua.addMediaItem(image);

// Define Share Bar plugin's Parameters (Page Level)
var shareBarParams ={
    userAction:ua,
    shareButtons:
    [
        { // General Share Button
            provider:'share',
            tooltip:'Share Button',
            userMessage:'Checkout America\'s Best Driver Report'
        }
    ],
    containerID: 'pageShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(shareBarParams);

// Define a UserAction onject
var uaCity = new gigya.socialize.UserAction();
uaCity.setLinkBack("http://www.allstate.com/");
uaCity.setTitle("America's Best Driver Report");
uaCity.addMediaItem(image);

// Define Share Bar plugin's Parameters (City Level)
var cityShareBarParams = {
    userAction: uaCity,
    shareButtons:
    [
        { // General Share Button
            provider: 'share',
            tooltip: 'Share Button',
            userMessage: 'Checkout America\'s Best Driver Report'
        }
    ],
    containerID: 'cityShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(cityShareBarParams);
