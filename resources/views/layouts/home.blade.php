<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Ghassan Aboud Group') }}</title>

    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    <!-- Fav -->
    <link rel="icon" href="{{ asset('images/fav.png') }}" sizes="32x32">
    <!-- <link rel="icon" href="{{ asset('images/fav.png') }}" sizes="192x192"> -->
    <!-- <link rel="apple-touch-icon" href="{{ asset('images/fav.png') }}"> -->
    <meta name="msapplication-TileImage" content="asset('images/fav.png')">
    <style>.cls-1{fill:#5b5e5e}.cls-2{fill:#cba82c}.loader-container{width:100%;height:100vh;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.loader-wrapper{width:100%;max-width:200px;margin:0 auto}.ga-loader{display:block;-webkit-transition:ease-out .3s;-o-transition:ease-out .3s;transition:ease-out .3s}.ga-loaded{display:none}</style>
</head>

<body class="dashboard">
    <div id="app">
        <v-app>
            <div :class="`ga-loader ${ isLoading == false ? 'ga-loaded' : 'ga-loading'}`">
                @include('components.loader')
            </div>
            <div v-if="isLoading == false">
                {{-- <navigation-main></navigation-main> --}}
                <v-main class="pt-0">
                    {{-- <navigation-left></navigation-left> --}}
                        <router-view></router-view>
                    {{-- <navigation-right></navigation-right> --}}
                </v-main>
                <!-- <div>
                <footer>
                    <v-sheet class="  pa-7"  min-height="10vh" >
                        <small class="black--text ">GAG’S OFFICIAL NETWORK © 2022 ALL RIGHTS RESERVED.</small>
                    </v-sheet>
                </footer>
                </div> -->
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>
            </div>
        </v-app>
    </div>
</body>

</html>
