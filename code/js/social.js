// Define an image media item:
var image = {
    type: 'image',
    src: 'http://localhost:63342/best_driver/code/img/home/share-thumbnail.jpg',
    href: 'http://www.allstate.com/'
}

// Define a UserAction onject
var ua = new gigya.socialize.UserAction();
ua.setLinkBack("http://www.allstate.com/");
ua.setTitle("Allstate America's Best Driver Report");
ua.setDescription("Is your city home to the best drivers in the U.S.? Allstate’s annual America’s #BestDriversReport has the answer.");
ua.addActionLink("Link", "http://www.allstate.com/");
ua.addMediaItem(image);

// Define Share Bar plugin's Parameters (Page Level)
var shareBarParams ={
    userAction:ua,
    shareButtons:
    [
        { // General Share Button
            provider:'share',
            tooltip:'Share Button',
            userMessage:'Is your city home to the best drivers in the U.S.? Allstate’s annual America’s #BestDriversReport has the answer.'
        }
    ],
    containerID: 'pageShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(shareBarParams);

// Define a UserAction onject
var uaCity = new gigya.socialize.UserAction();
uaCity.setLinkBack("http://www.allstate.com/");
uaCity.setTitle("Allstate America's Best Driver Report");
uaCity.setDescription("{City} is the {rank} safest driving city. See where your city ranks on America’s #BestDriversReport.");
uaCity.addActionLink("Link", "http://www.allstate.com/");
uaCity.addMediaItem(image);

// Define Share Bar plugin's Parameters (City Level)
var cityShareBarParams = {
    userAction: uaCity,
    shareButtons:
    [
        { // General Share Button
            provider: 'share',
            tooltip: 'Share Button',
            userMessage: '{City} is the {rank} safest driving city. See where your city ranks on America’s #BestDriversReport.',

        }
    ],
    containerID: 'cityShare' // location of the Share Bar plugin
}

// Load Share Bar plugin
gigya.socialize.showShareBarUI(cityShareBarParams);
