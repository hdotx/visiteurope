# Europe Website
Creating a website using GULP, NPM, SASS and more

1) Before starting the project, to open GIT cmd at the project directory and
   run "npm install"

2) Created SASS variables

3) Created SASS partial files:
     _ variables.scss (store all SASS variables )
     _ layout.scss
     _ typography.scss

4) Import all SASS partial files into 'app.scss' file via
   @ import '<filname - without extension & underscore in front>'
   --Note: there is NO SPACE between @ import, @ include, @ media, @ mixin
           I am noting this is because the README.md causing keyword highlight

5) Import Google Fonts into the SASS app.scss file instead of HTML files
   (aka * .html), eg.
   '@ import url(https://fonts.googleapis.com/css?family=Bitter:400,700|Open+Sans:400,700);'

6) Remove Bootstrap support in 'gulp.js'

7) Creating our own grid system, using SASS Mixins (aka our custom functions)
    1) create our own .container class
    2) create '_ mixins.scss' to enclose our user defined functions
         a) Mixins syntax: ' @ mixin <name>{} '
         b) ex:
              @ mixin tablet {
                 @ media only screen and (min-width: map-get($breakpoints, 'tablet')) {
                    @ content;
              }

            --Note: ' @ content; ' is a must have keyword in order for Mixin to work.   

            --Note: To call a map variable MUST USE keyword, syntax:
                    ==> "map-get(<variable name>, <its key>)"  <==
            --Note: Our map variable inside "_ variables.scss" file, for ex:
                        $breakpoints: (
                            phone: 480px,
                            tablet: 768px,
                            desktop: 1024px
                        );    

         c) To call the Mixin above inside '_ grid.scss' file, for ex:
                .container {
                    margin: 0 auto;
                    width: 70%;
                    @ include tablet {
                         width: 90%;
                    }
                }
                --Note: the width: 90%; above will substitute into the above
                        @ content;

8) Continuing of custom grid system
        a) creating .row class
              .row {
                  @ include clearfix;
                  @ include tablet{
                       margin: 0 -1em;
                  }
              }

        b) creating mobile device grid
             '* ='   means to look for all match that has a class name containing
              [class * ='column-' ]{
                    @ include border-box;
                    float: left;
                    padding: 1em;
                    width: 100%;
              }

         c) creating tablet grid
             @ include tablet {
                 @ for $i from 1 through $columns {
                     .medium-column-#{$i}{
                         width: 100% / $columns * $i;
                     }
                 }
             }

         d) creating desktop grid
             @ include desktop {
                 @ for $i from 1 through $columns {
                     .large-column-#{$i}{
                         width: 100% / $columns * $i;
                     }
                 }
             }


9) Remember to call any custom mixin, using the 'Directive' (aka -  @ include)

10) For better styling organization, having one large scss file containing all
    the styling can be disorganizing and later hard to search when you have to
    come back in the future.  Thus separating one SCSS file into several small
    SCSS file via partial SCSS file.
        a) Each small partial SCSS file start with underscore,
           eg.  "_ <file name>.scss"  
                "_ variables.scss" = this partial SCSS file contains
                                     all SASS variables
                "_ mixins.scss" = this file contains all SASS mixins custom
                                  functions
                ...etc
        b) To include these small partial SCSS files into the main SCSS file via
              " @ import '<filename>' without the extension ", eg.

              Using the above "_ variables.scss" to call inside "app.scss"
              code as follow " @ import 'variables' ".

11) In SASS, when styling, you do it in a nested way so that you can see what
             each elements relationship to one another easily, eg.

             div{
                 p {}
                 h2 {
                    color: ;   
                 }
                 div {
                    background-color: ;
                 }
             }

12) Lastly, applying the ' @ extend ' directive for one class to inherit
            another class (or id inherits another id) styling property.
        a) We have a .navigation class (a nav menu in top of the page) that
              the .footer-navigation class is inheriting its styling properties.
              Instead of writing two of the same styling properties with
              different class name.  
        b) This ' @ extend ' class or id help to re-use styling code.
        c) Ex: .navigation{}   

               .footer-navigation{
                  @ extend .navigation{}
               }
