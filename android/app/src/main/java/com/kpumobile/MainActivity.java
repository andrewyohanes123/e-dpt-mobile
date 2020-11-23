package com.kpumobile;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstance) {
    SplashScreen.show(this);
    super.onCreate(savedInstance);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "kpuMobile";
  }
}
