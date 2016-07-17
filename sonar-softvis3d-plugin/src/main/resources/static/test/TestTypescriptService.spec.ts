import { expect } from 'chai';

import { TestTypescriptService } from '../react/TestTypescriptService';

describe('TestTypescriptService', () => {

    it('should load movies', () => {
        expect(1).to.be.equal(1);
        expect(new TestTypescriptService().get()).to.be.equal("Yeah typescipt used");

    })

});