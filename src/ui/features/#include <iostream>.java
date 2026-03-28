#include <iostream>
using namespace std ;

class A {
    public :
       void showA(){
          cout <<"this is class A"<<endl;
       }
};
class B {
    public :
       void showB(){
        cout <<"this is class B"<<endl;
       }
};
class C :public B ,public A
{
     public :
     void showC(){
        cout<<"this is class C( derived form A and B)"<<endl;
     }

};

int main(){
    c obj;
    obj.show A();
    obj.show B();
    obj.show C();


    return 0;
}
sss