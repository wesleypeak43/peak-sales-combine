// @ts-nocheck
// Built-in city list for the Location field (offline fallback). Places used before on other candidates are listed first;
// when VITE_MAPBOX_TOKEN is set, Mapbox place search results are merged in as you type.
export const US_CITIES = `Abilene, TX|Akron, OH|Albany, NY|Albuquerque, NM|Allentown, PA|Amarillo, TX|Ames, IA|Anaheim, CA|Ann Arbor, MI|Arlington, TX|Arlington, VA|Asheville, NC|Athens, GA|Atlanta, GA|Auburn, AL|Augusta, GA|Aurora, CO|Austin, TX|Bakersfield, CA|Baltimore, MD|Baton Rouge, LA|Beaumont, TX|Bellingham, WA|Birmingham, AL|Bloomington, IN|Boca Raton, FL|Boiling Springs, NC|Boise, ID|Boston, MA|Boulder, CO|Bowling Green, KY|Bozeman, MT|Brownsville, TX|Buffalo, NY|Buies Creek, NC|Cape Girardeau, MO|Carbondale, IL|Cedar City, UT|Cedar Rapids, IA|Champaign, IL|Chapel Hill, NC|Charleston, SC|Charleston, WV|Charlotte, NC|Charlottesville, VA|Chattanooga, TN|Chicago, IL|Cincinnati, OH|Clemson, SC|Cleveland, OH|College Station, TX|Colorado Springs, CO|Columbia, MO|Columbia, SC|Columbus, GA|Columbus, OH|Conway, AR|Conway, SC|Corpus Christi, TX|Dallas, TX|Davidson, NC|Dayton, OH|Daytona Beach, FL|Denton, TX|Denver, CO|Des Moines, IA|Detroit, MI|Durham, NC|East Lansing, MI|Edinburg, TX|El Paso, TX|Eugene, OR|Evansville, IN|Fargo, ND|Fayetteville, AR|Flagstaff, AZ|Fort Collins, CO|Fort Lauderdale, FL|Fort Myers, FL|Fort Wayne, IN|Fort Worth, TX|Fresno, CA|Gainesville, FL|Grand Rapids, MI|Greensboro, NC|Greenville, NC|Greenville, SC|Hammond, LA|Harrisonburg, VA|Hartford, CT|Hattiesburg, MS|Honolulu, HI|Houston, TX|Huntsville, AL|Huntsville, TX|Indianapolis, IN|Iowa City, IA|Irving, TX|Jackson, MS|Jacksonville, FL|Johnson City, TN|Jonesboro, AR|Kansas City, MO|Kennesaw, GA|Knoxville, TN|Lafayette, LA|Lake Charles, LA|Laredo, TX|Las Cruces, NM|Las Vegas, NV|Lawrence, KS|Lexington, KY|Lincoln, NE|Little Rock, AR|Logan, UT|Long Beach, CA|Los Angeles, CA|Louisville, KY|Lubbock, TX|Macon, GA|Madison, WI|Manhattan, KS|Memphis, TN|Miami, FL|Milwaukee, WI|Minneapolis, MN|Mobile, AL|Monroe, LA|Montgomery, AL|Morgantown, WV|Murfreesboro, TN|Nacogdoches, TX|Nashville, TN|New Orleans, LA|New York, NY|Newark, NJ|Norfolk, VA|Norman, OK|Oklahoma City, OK|Omaha, NE|Orlando, FL|Oxford, MS|Pensacola, FL|Philadelphia, PA|Phoenix, AZ|Pittsburgh, PA|Plano, TX|Portland, OR|Provo, UT|Raleigh, NC|Reno, NV|Richmond, VA|Riverside, CA|Rochester, NY|Rock Hill, SC|Round Rock, TX|Ruston, LA|Sacramento, CA|Salt Lake City, UT|San Antonio, TX|San Diego, CA|San Francisco, CA|San Jose, CA|San Marcos, TX|Santa Barbara, CA|Savannah, GA|Scottsdale, AZ|Seattle, WA|Shreveport, LA|Spartanburg, SC|Spokane, WA|Springfield, MO|St. George, UT|St. Louis, MO|St. Petersburg, FL|Starkville, MS|State College, PA|Statesboro, GA|Stillwater, OK|Syracuse, NY|Tallahassee, FL|Tampa, FL|Tempe, AZ|Thibodaux, LA|Toledo, OH|Tucson, AZ|Tulsa, OK|Tuscaloosa, AL|Tyler, TX|Virginia Beach, VA|Waco, TX|Washington, DC|West Palm Beach, FL|Wichita, KS|Wichita Falls, TX|Wilmington, NC|Winston-Salem, NC`.split('|');

// Local matching: prefix on the city, then anywhere in "City, ST".
export function cityMatches(query, limit) {
  const q = String(query || '').trim().toLowerCase(); if (q.length < 2) return [];
  const starts = US_CITIES.filter(c => c.toLowerCase().startsWith(q));
  const within = US_CITIES.filter(c => !c.toLowerCase().startsWith(q) && c.toLowerCase().includes(q));
  return [...starts, ...within].slice(0, limit || 6);
}

// Optional live search (Mapbox Geocoding v6). Resolves to [] when no token is configured or the request fails.
export async function placeSearch(query, token) {
  const q = String(query || '').trim(); if (!token || q.length < 3) return [];
  try {
    const r = await fetch('https://api.mapbox.com/search/geocode/v6/forward?q=' + encodeURIComponent(q) + '&types=place&country=us&autocomplete=true&limit=6&access_token=' + encodeURIComponent(token));
    if (!r.ok) return [];
    const data = await r.json();
    return (data.features || []).map(f => { const p = f.properties || {}; const region = (p.context && p.context.region && (p.context.region.region_code || p.context.region.name)) || ''; return p.name ? p.name + (region ? ', ' + region : '') : ''; }).filter(Boolean);
  } catch (e) { return []; }
}
