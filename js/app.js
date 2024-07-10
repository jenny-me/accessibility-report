new Vue({
  el: '#dashboard',
  data: {
      issues: [],
      colorContrast: [],
      showQuotes: [],
      state: 'overview',
      scorecard: [
        { 'A': 9, 'AA': 11 }, // 1
        { 'A': 14, 'AA': 3 }, // 2
        { 'A': 5, 'AA': 5 }, // 3
        { 'A': 2, 'AA': 1 }, // 4
        { 'A': 30, 'AA': 20 } // total
      ],
      generalTiers: [
        {
          'tier': 'Simple',
          'description': 'Simple edits that can be completed by updating the content.'
        },
        {
          'tier': 'Complex',
          'description': 'Edits that can be completed by updating the content but are more advanced than simple edits. These edits may require some familiarity with code.'
        },
        {
          'tier': 'Requires Developer',
          'description': 'These issues are not accessible to users and must be fixed by a developer.'
        },
        {
          'tier': 'Document',
          'description': 'These issues are related to PDFs or other documents. Addressing these issues will require access to the source document.'
        },
        {
          'tier': 'None Required',
          'description': 'These issues have been flagged by an automated report but should not pose an actual hinderance to disabled users.'
        }
      ],
      loaded: false
  },
  created: function() {
    this.fetchData();
  },
  updated: function() {
    if (!this.loaded && this.issues.length > 0) {
      setOnClick();
      this.loaded = true;
    }
  },
  computed: {
    getQuoteTotal: function() {
      return this.issues.reduce((acc, item) => acc + item.quote, 0).toFixed(2);
    },
    getTotalFixes: function() {
      return this.issues.length;
    },
    sortedIssues: function() {
      function compare(a, b) {
        if (a.criteria < b.criteria)
          return -1;
        if (a.criteria > b.criteria)
          return 1;
        return 0;
      }
  
      return this.issues.sort(compare);
    }, 
    sortedByTier: function() {
      function compare(a, b) {
        if (a.tier < b.tier)
          return -1;
        if (a.tier > b.tier)
          return 1;
        return 0;
      }
  
      return this.sortedIssues.sort(compare);
    },
    uniqueTiers: function() {
      var filtered_array = [];
      for(var i =0; i < this.issues.length; i++) {
        if(filtered_array.indexOf(this.issues[i].tier) === -1) {
          filtered_array.push(this.issues[i].tier)
        }
      }
      return filtered_array;
    },
    uniqueCriteria: function() {
      var filtered_array = [];
      var check_array = [];
      for(var i =0; i < this.issues.length; i++) {
        if(check_array.indexOf(this.issues[i].criteria) === -1) {
          check_array.push(this.issues[i].criteria);
          filtered_array.push(this.issues[i]);
        }
      }
      return filtered_array;
    },
    uniqueFailedCriteria: function() {
      var failedIssues = this.filterFailed();
      var filtered_array = [];
      var check_array = [];
      for(var i =0; i < failedIssues.length; i++) {
        if(check_array.indexOf(failedIssues[i].criteria) === -1) {
          check_array.push(failedIssues[i].criteria);
          filtered_array.push(failedIssues[i]);
        }
      }
      return filtered_array;
    }
  },
  methods: { 
    fetchData: function() {
      fetch(dataPath)
          .then(res => res.json())
          .then(json => {
            this.issues = json.myIssues;
            this.colorContrast = json.myContrast;
            this.showQuotes = json.myQuotes;

            this.processContrast();
            return json;
        });
    },
    changeState: function(state) {
      this.state = state;
    },
    processContrast: function() {
      for(var i =0; i < this.colorContrast.length; i++) {
        let compareRatio = 4.5;
        let contrastValue = this.calculateRatio(this.colorContrast[i].foreground, this.colorContrast[i].background);
        if(this.colorContrast[i].largeText === "1") {
          compareRatio = 3;
        }
        this.colorContrast[i].ratio = contrastValue + ":1";
        this.colorContrast[i].rating = contrastValue >= compareRatio ? "pass" : "fail";
      }
    },
    checkIssue: function(criteria) {
      var passFail;
      var filtered = this.filterIssue(criteria);
      if ( filtered.length > 0 ) {
        passFail = 'failed';
      } else {
        passFail = 'passed';
      }
      return passFail;
    },
    filterIssue(criteria) {
      var filtered = this.sortedByTier.filter(function(issue){
        return issue.criteria === criteria;
      });
      return filtered;
    },
    filterTier(tier) {
      var filtered = this.sortedByTier.filter(function(issue){
        return issue.tier === tier;
      });
      return filtered;
    },
    filterFailed() {
      var filtered = this.sortedByTier.filter(function(issue){
        return issue.completed === false;
      });
      return filtered;
    },
    filterUniqueLevel(level) {
      var filtered = this.uniqueCriteria.filter(function(issue){
        return issue.level === level;
      });
      return filtered;
    },
    filterFailedUniqueLevel(level) {
      var filtered = this.uniqueFailedCriteria.filter(function(issue){
        return issue.level === level;
      });
      return filtered;
    },
    getTierTotal: function(tier) {
      var filtered = this.issues.filter(function(issue){
        return issue.tier === tier;
      });
      return filtered.reduce((acc, item) => acc + item.quote, 0).toFixed(2);
    },
    getAScore: function(criteria) {
      var score = 0;
      var numIssues = 0;
      var criteriaIndex = criteria - 1;
      var max = this.scorecard[criteriaIndex].A;
      var filtered = this.filterUniqueLevel('A');

      if( criteria === '5') {
        numIssues = filtered.length;
      }
      else {
        for(var i =0; i < filtered.length; i++) {
          if( filtered[i].criteria.substring(0,1) === criteria) {
            numIssues++;
          }
        }
      }

      score = max - numIssues;
      return score + ' of ' + max; 
    },
    getAAScore: function(criteria) {
      var score = 0;
      var numIssues = 0;
      var criteriaIndex = criteria - 1;
      var max = this.scorecard[criteriaIndex].AA;
      var filtered = this.filterUniqueLevel('AA');
      
      if( criteria === '5') {
        numIssues = filtered.length;
      }
      else {
        for(var i =0; i < filtered.length; i++) {
          if( filtered[i].criteria.substring(0,1) === criteria) {
            numIssues++;
          }
        }
      }

      score = max - numIssues;
      return score + ' of ' + max;
    },
    getNewAScore: function(criteria) {
      var score = 0;
      var numIssues = 0;
      var criteriaIndex = criteria - 1;
      var max = this.scorecard[criteriaIndex].A;
      var filtered = this.filterFailedUniqueLevel('A');
  
      if( criteria === '5') {
        numIssues = filtered.length;
      }
      else {
        for(var i =0; i < filtered.length; i++) {
          if( filtered[i].criteria.substring(0,1) === criteria) {
            numIssues++;
          }
        }
      }
  
      score = max - numIssues;
      return score + ' of ' + max; 
    },
    getNewAAScore: function(criteria) {
      var score = 0;
      var numIssues = 0;
      var criteriaIndex = criteria - 1;
      var max = this.scorecard[criteriaIndex].AA;
      var filtered = this.filterFailedUniqueLevel('AA');
      
      if( criteria === '5') {
        numIssues = filtered.length;
      }
      else {
        for(var i =0; i < filtered.length; i++) {
          if( filtered[i].criteria.substring(0,1) === criteria) {
            numIssues++;
          }
        }
      }
  
      score = max - numIssues;
      return score + ' of ' + max;
    },
    hexToRgb: function(hex) {
      // function from https://stackoverflow.com/a/5624139/3695983
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    luminance: function(r, g, b) {
      // function from https://stackoverflow.com/a/9733420/3695983  
      var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
          ? v / 12.92
        : Math.pow( (v + 0.055) / 1.055, 2.4 );
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    },
    calculateRatio: function(color1, color2) {
      const color1rgb = this.hexToRgb(color1);
      const color2rgb = this.hexToRgb(color2);
    
      // calculate the relative luminance
      const color1luminance = this.luminance(color1rgb.r, color1rgb.g, color1rgb.b);
      const color2luminance = this.luminance(color2rgb.r, color2rgb.g, color2rgb.b);
    
      let brightest = Math.max(color1luminance, color2luminance);
      let darkest = Math.min(color1luminance, color2luminance);
      const ratio = (brightest + 0.05) / (darkest + 0.05);
      const roundedRatio = Math.round(ratio * 10) / 10
    
      return roundedRatio;
    }
  }
});