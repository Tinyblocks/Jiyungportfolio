module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy({"images": "images"});
  eleventyConfig.addPassthroughCopy({"assets": "assets"});
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy({"admin": "admin"});

  eleventyConfig.addCollection("projects", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a,b) => {
      const ay = a.data.year || 0;
      const by = b.data.year || 0;
      if (ay !== by) return by - ay;
      const at = (a.data.title || "").toLowerCase();
      const bt = (b.data.title || "").toLowerCase();
      return at.localeCompare(bt);
    });
  });

  eleventyConfig.addFilter("globPaths", (pattern) => {
    if (!pattern) return [];
    try{
      const fg = require("fast-glob");
      const results = fg.sync(pattern, { cwd: process.cwd(), absolute: false, caseSensitiveMatch: false });
      return results.map(p => p.startsWith("/") ? p : `/${p}`);
    }catch(e){
      return [];
    }
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: "/"
  };
};
