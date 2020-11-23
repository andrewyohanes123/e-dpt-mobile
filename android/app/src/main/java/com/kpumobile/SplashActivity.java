package com.kpumobile;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);

        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}