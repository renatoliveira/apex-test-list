/**
 * This test is not listed by other classes in the folder or test suites.
 * It will be found by having the annotation on it.
 */
@IsTest
private class UnlistedTest  {

  @IsTest
  static void test() {
    Assert.fail('hello');
  }
}