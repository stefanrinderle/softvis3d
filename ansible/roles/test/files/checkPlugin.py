from pyvirtualdisplay import Display
from selenium import webdriver

import time

HOST_BASE="http://localhost:9000"

profile = webdriver.firefox.firefox_profile.FirefoxProfile()

# Fiddle with FF preferences
set_pref = profile.set_preference
set_pref("signed.applets.codebase_principal_support",    True)
set_pref("capability.principal.codebase.p0.granted",     "UniversalXPConnect");
set_pref("capability.principal.codebase.p0.id",          HOST_BASE);
set_pref("capability.principal.codebase.p0.subjectName", "");
set_pref("webgl.prefer-native-gl", True);
set_pref("webgl.force-enabled", True);
set_pref("dom.max_script_run_time", 60);

# https://developer.mozilla.org/En/Same-origin_policy_for_file%3A_URIs
# http://www.generalinterface.org/docs/display/DEVBLOG/2010/04/15/Stopping+the+repetitious+security+prompt+on+Firefox+GI+Builder
set_pref("security.fileuri.strict_origin_policy", False);

# Set anti-aliasing
set_pref("webgl.msaa-force", True);
set_pref("webgl.msaa-level", 4);

display = Display(visible=0, size=(1024, 768))
display.start()

browser = webdriver.Firefox(firefox_profile=profile)

page = "/plugins/resource/1?page=SoftVis3D"

browser.get(HOST_BASE + page)
assert 'SonarQube' in browser.title

time.sleep(10)
browser.save_screenshot('/tmp/screenshotTempFolder/startScreen.png')

# show city view
browser.find_element_by_xpath("//*[@id='city-loader']/button").click()

time.sleep(20)
browser.save_screenshot('/tmp/screenshotTempFolder/cityModel.png')

browser.find_element_by_xpath("//*[@id='loader-buttons']/div[2]").click()
browser.find_element_by_xpath("//*[@id='dependency-loader']/div[2]/button").click()

time.sleep(20)
browser.save_screenshot('/tmp/screenshotTempFolder/dependencyView.png')

browser.quit()
display.stop()
