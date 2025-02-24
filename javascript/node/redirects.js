/**
 * Sitemap to Django Redirects Converter
 * 
 * This script extracts URLs from a sitemap.xml file and converts them to Django redirect syntax.
 * It generates Django URL redirects in the format expected by Django's URL patterns, with each
 * URL redirecting to the same path.
 * 
 * Features:
 * - Works with any domain in the sitemap.xml file
 * - Organizes redirects in groups of 50 for better maintainability
 * - Formats output to match Django URL configuration syntax
 * 
 * Setup Instructions:
 * 1. Create a new folder for this script (recommended but optional)
 * 2. Save this file as "redirects.js" in that folder
 * 3. Download your website's sitemap.xml:
 *    - Visit your website's sitemap (typically at https://yourdomain.com/sitemap.xml)
 *    - Save the XML file as "sitemap.xml" in the same folder as this script
 * 
 * Running the Script:
 * 1. Open a terminal/command prompt
 * 2. Navigate to the folder containing both files:
 *    cd path/to/your/folder
 * 3. Run the script with Node.js:
 *    node redirects.js
 * 4. The script will create a file called "django_redirects.txt" in the same folder
 * 5. Open django_redirects.txt to see your formatted Django redirects
 * 
 * Requirements:
 * - Node.js must be installed either globally or via NVM
 *   (download from https://nodejs.org/ or use NVM: https://github.com/nvm-sh/nvm)
 * - No additional npm packages are required - this script uses only Node.js core modules
 * - Access to your website's sitemap.xml
 */

const fs = require('fs');

// Read the sitemap file directly
const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');

// Extract URLs from sitemap with a generic domain capture
// This regex pattern extracts the domain and path parts separately
const urlRegex = /<loc>(https?:\/\/(?:www\.)?([^\/]+)\/([^<]+))<\/loc>/g;
const paths = [];
let match;

while ((match = urlRegex.exec(sitemapContent)) !== null) {
  // match[1] = full URL
  // match[2] = domain
  // match[3] = path (everything after the domain)
  paths.push(match[3]);
}

// Generate redirects with proper grouping
let output = 'redirects = [\n';

// Process URLs in chunks of 50
const chunkSize = 50;

for (let i = 0; i < paths.length; i++) {
  const path = paths[i];
  // Format each redirect with two spaces of indentation
  // Creates a Django URL pattern that redirects to the same path
  output += `  url(r'^${path}/?$', RedirectView.as_view(url='/${path}', permanent=True)),\n`;
  
  // Add chunk separator after every 50 URLs except the last chunk
  // This helps keep the redirect lists manageable in large sitemaps
  if ((i + 1) % chunkSize === 0 && i < paths.length - 1) {
    output += ']\n\nredirects += [\n';
  }
}

output += ']';

// Write the results to a new file
fs.writeFileSync('django_redirects.txt', output);

// Calculate number of groups
const totalGroups = Math.ceil(paths.length / chunkSize);
console.log("Generated " + paths.length + " redirects in " + totalGroups + " groups of " + chunkSize);