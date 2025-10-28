class Functions {
  /*
     sceleton for strategy for phones or tablets or monitors 
     we also need types
    */

  // function that evaluated from array of xpathes the price and filter just those who are in condition

  // query function that acctually get the right strategy type if exists then click on the type button and then fetches array from xpath
  // class im guessing

  async searchItemsByNameUnderPrice(
    query: string,
    maxPrice: number,
    limit = 5
  ): Promise<string[]> {}
}
