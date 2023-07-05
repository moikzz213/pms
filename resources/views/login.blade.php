@extends('layouts.app')

@section('content')
    <div id="g-login" class="container-fluid py-16 d-flex flex-column align-center gag-container-bg">
        <div class="col-xs-12 col-sm-8 col-md-4" style="z-index: 2">
            <login-form></login-form>
        </div>
    </div>
@endsection
