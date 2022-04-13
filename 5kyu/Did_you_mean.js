class Dictionary {
  constructor(dic) {
    this.dic = dic
    this.costs = {
      replace: 1,
      insert: 1,
      remove: 1
    }
  }

  findMostSimilar(word) {
    return this._findMostSimilar(word)
  }

  _findMostSimilar(word) {
    if (this.dic.includes(word)) {
      return word
    }

    const ratings = this.dic.reduce((acc, item) => {
      const diff = this._searchDiffByLevenshtein(word, item)
      acc[item] = diff
      return acc
    }, {})

    const minDiff = Math.min(...Object.values(ratings))
    return Object.entries(ratings)
      .reduce((acc, [key, val]) => {
        if (val === minDiff) {
          acc.push(key)
        }
        return acc
      }, [])
      .join(', ')
  }

  _searchDiffByLevenshtein(s1, s2) {
    let i, j, l1, l2, flip, ch, ii, ii2, cost, cutHalf;
    l1 = s1.length;
    l2 = s2.length;

    const cr = this.costs.replace;
    const ci = this.costs.insert;
    const cd = this.costs.remove;
  
    cutHalf = flip = Math.max(l1, l2);
  
    const minCost = Math.min(cd, ci, cr);
    const minD = Math.max(minCost, (l1 - l2) * cd);
    const minI = Math.max(minCost, (l2 - l1) * ci);
    const buf = new Array((cutHalf * 2) - 1);
  
    for (i = 0; i <= l2; ++i) {
        buf[i] = i * minD;
    }
  
    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
        ch = s1[i];
  
        buf[flip] = (i + 1) * minI;
  
        ii = flip;
        ii2 = cutHalf - flip;
  
        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
            cost = (ch === s2[j] ? 0 : 1);
            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
        }
    }
    return buf[l2 + cutHalf - flip];
  }
}