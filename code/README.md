![T-3 icon](http://t3-assets.uat-l.thethinktank.com/images/T3logo.png)
<hr />
# Technical Documentation
<hr />
**Prepared by:** 	David Vo<br/>
**Last Updated:** 	07/14/2014<br/>
**Version**:		v1.0.0

<br/>

<table>
	<tr>
		<td><b>Client</b></td>
		<td><b>Project</b></td>
	</tr>
	<tr>
		<td>Allstate</td>
		<td>Landing Pages - America's Best Driver</td>
	</tr>
</table>
<br />
<hr />
## Table of Contents
<hr />
1. Overview
	a. Static Page
	b. Interactive Map
	c. JSON File
	d. Repository
2. Team
3. Technical Architecture
4. Assets
5. Deployment Strategy
	a. Lorem Ipsum
	b. URLs
6. QA
7. Changelog

<br/>
<hr />
## 1. Overview
<hr />
A landing page that will live on the client's CMS (LiveSite `LS`). Included is a reusable interactive map that can be repurposed annually.

### a. Static Page
* Leverage past Static Pages already delivered:

		https://<USERNAME>@stash.t-3.com/scm/al/website.git	
* YouTube Video Embed (already available)
* Carousel (already available)
* Twitter `Share`

		<div id="custom-tweet-button">
		  <a href="https://twitter.com/share?url=https%3A%2F%2Ftwitter.com%2Fpages%2Ftweet-button" target="_blank">Tweet</a>
		</di>
* Downloadable PDF in header		


### b. Interactive Map
* Loads `JSON`
	a. Use localStorage for cacheing.
	b. <font color="red"><strong>ATTENTION</strong></font> May have to include entire object within JS file due to `LS` support. Waiting on client to provide update.
* `Tabs` (Filters)
	a. Each Filter has separate color scheme 
* `Filter List`
	a. List is updated and scrolled to the top on any Filter change
	a. Clicking on city from list will activate `Pop-up` on map
* `Markers` (Circles) size varies based on Ranking
	a. Clicking on a `Marker` will display a `Pop-Up`
	b. `Markers` should have an active state	
* `Pop-up` displays detailed information from data all Rankings (2014) that are found in all Filters.
	a. 2014 will display all rankings that can be found under other `Tabs`
	b. 2005-2013 will only display Top Cities (Best Driver) data
	c. Dismissed by clicking close button or anything outisde of `Pop-up`
	d. Should never display more than 1 at the same time 
	e. Any active `Pop-up` should be dismissed when navigating through different `Tabs`
* Social `Share`	
	a. Can Share the app itself
	b. `Pop-Up` has separate `Share` Button based on Ranking. 
		1. Share message is Dynamic
	<table>
		<tr>
			<td rowspan=2><strong>Gigya Simple Share</strong></td>
			<td><a href="http://developers.gigya.com/040_Demos/020_Social_Plugins/0355_Share">http://developers.gigya.com/040_Demos/020_Social_Plugins/0355_Share</a></td>
		</tr>
		<tr>
			<td><a href="http://developers.gigya.com/040_Demos/020_Social_Plugins/033_Share_Bar_Plugin">http://developers.gigya.com/040_Demos/020_Social_Plugins/033_Share_Bar_Plugin</a></td>
		</tr>
		<tr>
			<td><strong>API KEY</strong></td>
			<td>3_Uk95Mmi5mBePVs-6Y5rUJH3o6duMRC8WmoWuEB9aw-Vcg89IK3ojb3Y9Dp4T8hLT</td>
		</tr>
	</table>
* Map supports Zooming and Panning
	a. Zoom Max of 4 - 2 Marker sizes; top 10 for Large and the rest is small.
		1. Zoom Level1 - 1-10 Markers show numbers
		2. Zoom Level2 - All Markers show numbers + Major city names
		3. Zoom Level3 - All Markers show numbers + More city names
		4. Zoom Level4 - All Markers show number + All city names
	b. Zoom Level indicator. States (Levels) between the +/- does not have to be clickable.
	c. Zoom needs to be increased to cover more ground
		1. Zoom Level1 - US
		2. Zoom Level2 - Regional
		3. Zoom Level3 - State
		4. Zoom Level4 - City
	d. Clicking on a city name from the `Filter List` while Zooomed in will zoom back out and activate `Pop-up`
* Timeline Bar (below map)
	a. Toggle different data based on year
	b. Functionlity only supports Top Cities (Best Drivers). Timeline would be disabled (greyed out) for all other Filter scenarios.
		* Timeline drag should reinitialize to 2014
* Geolocation Support - Initialize app with City and State
##### Sample
		var map = new bestDriver('Austin, TX');
	
		
### c. JSON

* Needs 2005-2014 Rankings
* Consider data that needs to be filtered by years and categories; Top Cities (Best Drivers), Populated Areas, Dense Areas, Rain and Snow and All Conditions
##### Sample
		{
			latLng: [30.25, -97.75],
			name: 'Austin, TX',
			zoom: {
				1: yes,
				2: no,
				align: left, //left, right, top, bottom
			}		 
			ranking: {
				2014: {
					best_driver: 159,
					population: 125,
					density: 161,
					rain_snow: 159,
					all: 162
				},
				2013: {
					best_driver: 155
				},
				2012: {
					best_driver: 149
				},
				...			
			}
		}		
		

### d. Repository
The GIT repository is located at: 

	https://<USERNAME>stash.t-3.com/scm/al/landing-pages.git
	
This Landing Page resides under: 	

	deploy/best_driver
	
<br/>
<hr />
## 2. Team
<hr />
<table>
	<tr>
		<td align="left"><b>Job</b></td>
		<td align="left"><b>Teammember</b></td>
		<td align="left"><b>Key</b></td>
	</tr>
	<tr>
		<td>Executive Producer:</td>
		<td>Kim Gannon</td>
		<td>KG</td>
	</tr>	
	<tr>
		<td>Producer:</td>
		<td>Olivia Jones</td>
		<td>OJ</td>
	</tr>
	<tr>
		<td>Account:</td>
		<td>Katie Minton</td>
		<td>KM</td>
	</tr>	
	<tr>
		<td>Assoc Creative Director:</td>
		<td>Jennifer Faber</td>
		<td>JF</td>
	</tr>		
	<tr>
		<td>Art:</td>
		<td>Sarah Stevenson</td>
		<td>SS</td>
	</tr>		
	<tr>
		<td>Senior Copywrter:</td>
		<td>Ashley Lapin</td>
		<td>RP</td>
	</tr>	
	<tr>
		<td>Assoc Dev Director:</td>
		<td>David Vo</td>
		<td>DV</td>
	</tr>
	<tr>
		<td>Developer:</td>
		<td>Robert Gonzales</td>
		<td>RG</td>
	</tr>
	<tr>
		<td>UX:</td>
		<td>Diana Turner</td>
		<td>DT</td>
	</tr>			
	<tr>
		<td>QA</td>
		<td>TBD</td>
		<td></td>
	</tr>
</table>

<br/>
<hr />
## 3. Technical Architecture
<hr />
### a. Overview
It needs to be developed with Mobile portability in mind -- Allstate plans on creating an mDot version.

### b. Specifications

#####Libraries and Guidelines A.com is using that T3 is aware of:
<table>
	<tr>
		<td align="left"><b>Files</b></td>
		<td align="left"><b>Version</b></td>
		<td align="left"><b>Details</b></td>
	</tr>
	<tr>
		<td>StyleSheet</td>
		<td>CSS2</td>
		<td>Site does not support CSS3. Use Descendent Selectors with caution (nesting). CSS needs to be modularized so that ADT can easily grab CSS snippets.</td>		
	</tr>	
	<tr>
		<td>JQuery</td>
		<td>1.9.1</td>
		<td>Fast, small, and feature-rich JavaScript library</td>
	</tr>
	<tr>
		<td>Touchswipe</td>
		<td>1.6.5</td>
		<td>TouchSwipe is a jquery plugin to be used with jQuery on touch input devices such as iPad, iPhone etc.</td>	</tr>
	<tr>
		<td>Cycle Plugin</td>
		<td>3.0.3</td>
		<td>A slideshow plugin that supports many different types of transition effects.</td>	</tr>		
	<tr>
		<td>jqModal</td>
		<td>1.1.0</td>
		<td>Help you display modals, popups, and notices.</td>	</tr>		
	<tr>
		<td>HTML</td>
		<td>HTML4</td>
		<td>Site does not support HTML5.</td>	
	</tr>
</table>

#####Libraries needed for this project:
<table>
	<tr>
		<td align="left"><b>Files</b></td>
		<td align="left"><b>Version</b></td>
		<td align="left"><b>Details</b></td>
	</tr>
	<tr>
		<td>jVectorMap</td>
		<td>1.2.2</td>
		<td>An interactive map that only uses native browser technologies like JavaScript, CSS, HTML, SVG or VML.</td>		
	</tr>
</table>


<br/>
<hr />
## 4. Assets
<hr/>
Comp is listed below:

* <b>[Revision 1](https://clients.t-3.com/allstate/jobs/24957/design_r1/index.aspx)</b>
* <b>[Revision 2](https://clients.t-3.com/allstate/jobs/24957/design_r2/index.aspx)</b>

<br/>
<hr />
## 5. Deployment Strategy
<hr/>
Developer should always branch from `development`. Only `DV` can merge back to `Master`. Unless stated otherwise, there must be a Pull Request for all commits. Because of `LS` integration, code should <b>NOT</b> be minified unless it's a Library.

### a. Merging
Always merge to `Internal` for Art and QA Review. When approved should you then merge to `UAT` for client review. `Bamboo` polls all `Internal` merges and will auto-deploy. `UAT` will require a manual build (see URLs).

Internal Branch

	release/internal
		
UAT Branch

	release/uat

### b. URLs
<table>
	<tr>
		<td align="left"><b>Bamboo</b></td>
		<td align="left"><a href="http://bamboo.t-3.com/browse/ALLLP">http://bamboo.t-3.com/browse/ALLLP</a></td>
	</tr>
	<tr>
		<td align="left"><b>Internal (Staging)</b></td>
		<td align="left"><a href="http://allstate-lp.internal.thethinktank.com/best_driver/">http://allstate-lp.internal.thethinktank.com/best_driver/</a></td>
	</tr>
	<tr>
		<td align="left"><b>UAT (Staging)</b></td>
		<td align="left"><a href="https://allstate-lp.uat.thethinktank.com/best_driver/">https://allstate-lp.uat.thethinktank.com/best_driver/</a></td>
	</td>
</table>

<table>
	<tr>
		<td align="left"><b>Username</b></td>
		<td align="left"><b>Password</b></td>
	</tr>
	<tr>
		<td>allstateuser</td>
		<td>@ll.State!</td>
	</td>
</table>


<br/>
<hr />
## 6. QA
<hr />
* <b>Desktop</b>
	* Windows - IE8+
	* OSX - Safari (Latest)
	* Both - Firefox (Latest), Chrome (Latest)

<br/>
<hr />
## 7. Changelog
<hr />
* v1.0.0 - Initial TDD.

<br/>