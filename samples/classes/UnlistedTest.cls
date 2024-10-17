/**
 * This test is not listed by other classes in the folder. It is
 * listed only in the SampleSuite test suite.
 */
@IsTest
private class UnlistedTest  {

  @IsTest
  static void test() {
    Assert.fail('hello');
  }
}