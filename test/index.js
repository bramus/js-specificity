import { equal, deepEqual } from 'assert';
import { calculate, compare, moreSpecificThan, lessSpecificThan, equals, sort, ascending, descending, highest, lowest } from '../src/index.js';

describe('CALCULATE', () => {
    describe('Examples from the spec', () => {
        it('* = (0,0,0)', () => {
            deepEqual(calculate('*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('li = (0,0,1)', () => {
            deepEqual(calculate('li')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('ul li = (0,0,2)', () => {
            deepEqual(calculate('ul li')[0].toObject(), { a: 0, b: 0, c: 2 });
        });
        it('UL OL+LI  = (0,0,3)', () => {
            deepEqual(calculate('UL OL+LI ')[0].toObject(), { a: 0, b: 0, c: 3 });
        });
        it('H1 + *[REL=up] = (0,1,1)', () => {
            deepEqual(calculate('H1 + *[REL=up]')[0].toObject(), { a: 0, b: 1, c: 1 });
        });
        it('UL OL LI.red = (0,1,3)', () => {
            deepEqual(calculate('UL OL LI.red')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
        it('LI.red.level = (0,2,1)', () => {
            deepEqual(calculate('LI.red.level')[0].toObject(), { a: 0, b: 2, c: 1 });
        });
        it('#x34y = (1,0,0)', () => {
            deepEqual(calculate('#x34y')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it('#s12:not(FOO) = (1,0,1)', () => {
            deepEqual(calculate('#s12:not(FOO)')[0].toObject(), { a: 1, b: 0, c: 1 });
        });
        it('.foo :is(.bar, #baz) = (1,1,0)', () => {
            deepEqual(calculate('.foo :is(.bar, #baz)')[0].toObject(), { a: 1, b: 1, c: 0 });
        });
    });

    describe('Examples by Kilian', () => {
        it('header h1#sitetitle > .logo = (1,1,2)', () => {
            deepEqual(calculate('header h1#sitetitle > .logo')[0].toObject(), { a: 1, b: 1, c: 2 });
        });
        it('ul > li:is(.highlighted, .active) = (0,1,2)', () => {
            deepEqual(calculate('ul > li:is(.highlighted, .active)')[0].toObject(), { a: 0, b: 1, c: 2 });
        });
        it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => {
            deepEqual(calculate('header:where(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
    });

    describe('Examples by Kilian, remixed', () => {
        it('header:has(#top) nav li:nth-child(2n + 1) = (1,1,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 1, b: 1, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo)')[0].toObject(), { a: 1, b: 2, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)')[0].toObject(), { a: 2, b: 1, c: 3 });
        });
    });

    describe('Pseudo-Element Selector = (0,0,1)', () => {
        it('::after', () => {
            deepEqual(calculate('::after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::cue', () => {
            deepEqual(calculate('::cue')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::before', () => {
            deepEqual(calculate('::before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-line', () => {
            deepEqual(calculate('::first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-letter', () => {
            deepEqual(calculate('::first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#index
    describe('Pseudo-Element improperly used as Pseudo-Class Selector = (0,0,1)', () => {
        it(':before', () => {
            deepEqual(calculate(':before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':after', () => {
            deepEqual(calculate(':after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-line', () => {
            deepEqual(calculate(':first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-letter', () => {
            deepEqual(calculate(':first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Pseudo-Class Selector = (0,1,0)', () => {
        it(':hover', () => {
            deepEqual(calculate(':hover')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it(':focus', () => {
            deepEqual(calculate(':focus')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
    });

    describe('CSS :is() - :matches() - :any() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':is(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':is(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':matches(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':matches(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-moz-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':-moz-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-webkit-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':-webkit-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :has() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':has(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':has(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :not() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':not(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':not(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :where() = Replaced by zero', () => {
        it(':where(#foo, .bar, baz) = (0,0,0)', () => {
            deepEqual(calculate(':where(#foo, .bar, baz)')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors#namespaces
    describe('Namespaced Selectors', () => {
        it('ns|* = (0,0,0)', () => {
            deepEqual(calculate('ns|*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('ns|a = (0,0,1)', () => {
            deepEqual(calculate('ns|a')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });
});

describe('COMPARE', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    describe('compare', () => {
        it('compare(sHigh, sLow) = -1', () => {
            deepEqual(compare(sHigh, sLow), -1);
        });
        it('compare(sLow, sHigh) = 1', () => {
            deepEqual(compare(sLow, sHigh), 1);
        });
        it('compare(sMed, sMed) = 0', () => {
            deepEqual(compare(sMed, sMed), 0);
        });
    });

    describe('moreSpecificThan', () => {
        it('moreSpecificThan(sHigh, sLow) = true', () => {
            deepEqual(moreSpecificThan(sHigh, sLow), true);
        });
        it('moreSpecificThan(sLow, sHigh) = false', () => {
            deepEqual(moreSpecificThan(sLow, sHigh), false);
        });
        it('moreSpecificThan(sMed, sMed) = false', () => {
            deepEqual(moreSpecificThan(sMed, sMed), false);
        });
    });

    describe('lessSpecificThan', () => {
        it('lessSpecificThan(sHigh, sLow) = false', () => {
            deepEqual(lessSpecificThan(sHigh, sLow), false);
        });
        it('lessSpecificThan(sLow, sHigh) = true', () => {
            deepEqual(lessSpecificThan(sLow, sHigh), true);
        });
        it('lessSpecificThan(sMed, sMed) = false', () => {
            deepEqual(lessSpecificThan(sMed, sMed), false);
        });
    });

    describe('equals', () => {
        it('equals(sHigh, sLow) = false', () => {
            deepEqual(equals(sHigh, sLow), false);
        });
        it('equals(sLow, sHigh) = false', () => {
            deepEqual(equals(sLow, sHigh), false);
        });
        it('equals(sMed, sMed) = true', () => {
            deepEqual(equals(sMed, sMed), true);
        });
    });
});

describe('SORT', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];
    const sortedHighToLow = [sHigh, sMed, sLow];
    const sortedLowToHigh = [sLow, sMed, sHigh];

    describe('ascending', () => {
        it('ascending(notSorted)', () => {
            deepEqual(ascending(notSorted), sortedLowToHigh);
        });
        it('sort(notSorted, "ASC")', () => {
            deepEqual(sort(notSorted, "ASC"), sortedLowToHigh);
        });
    });

    describe('descending', () => {
        it('descending(notSorted)', () => {
            deepEqual(descending(notSorted), sortedHighToLow);
        });
        it('sort(notSorted, "DESC")', () => {
            deepEqual(sort(notSorted, "DESC"), sortedHighToLow);
        });
    });

});

describe('FILTER', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];

    describe('highest', () => {
        it('highest(notSorted)', () => {
            deepEqual(highest(notSorted), sHigh);
        });
    });

    describe('lowest', () => {
        it('lowest(notSorted)', () => {
            deepEqual(lowest(notSorted), sLow);
        });
    });

});
