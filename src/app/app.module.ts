import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NouisliderModule } from "ng2-nouislider";
import { SharedModule } from "./shared";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NouisliderModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
